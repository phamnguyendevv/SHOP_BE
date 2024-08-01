import mysql from "mysql2";
import getSlug from "speakingurl";
import crypto from "crypto";
import Connection from "../db/configMysql.js";
import CategoryService from "./categoryServices.js";
import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import ClassifyModel from "../models/classifyModel.js";
import TechnologyModel from "../models/technologyModel.js";
import categoryProductModel from "../models/categoryProductModel.js";
import categoryProdcutModel from "../models/categoryProductModel.js";
import ProductTechnologyModel from "../models/productTechnologyMode.js";
import ImageModel from "../models/imageModel.js";
const connection = await Connection();


let ProductServices = {
  
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: "vn" });
    let fullSlug, existingProductSlug;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}-${randomInt}`;
      existingProductSlug = await ProductModel.getProductByField(
        connection,
        "slug",
        fullSlug
      );
    } while (existingProductSlug);
    return fullSlug;
  },

  //addProduct
  addProduct: async (data) => {
    const { productData, classifyData } = data;
    // Bắt đầu transaction
    const transaction = await connection.beginTransaction();
    try {
      // Generate slug và thêm sản phẩm
      productData.slug = await ProductServices.createSlug(productData.name);
      const newProduct = await ProductModel.addProduct(
        transaction,
        productData
      );
      const productId = newProduct.insertId;

      // Xử lý categories, technologies, và images
      await Promise.all([
        handleCategories(transaction, productId, productData.categories),
        handleTechnologies(transaction, productId, productData.technologies),
        handleImages(transaction, productId, productData.images),
      ]);

      // Xử lý classify data
      if (!classifyData || classifyData.length === 0) {
        throw new Error("Không tìm thấy phân loại sản phẩm");
      }
      await handleClassifyData(transaction, productId, classifyData);

      // Commit transaction
      await transaction.commit();
      return newProduct;
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  },

  updateProduct: async (data) => {
    const { productData, classifyData } = data;
    const productId = Number(productData.id);
    // Bắt đầu transaction
    const transaction = await connection.beginTransaction();
    try {
      // Generate slug if name is updated
      if (productData.name) {
        productData.slug = await ProductServices.createSlug(productData.name);
      }
      // Update product
      await ProductModel.updateProduct(transaction, productData);

      // Handle categories
      if (productData.categories?.length > 0) {
        await categoryProdcutModel.updateProductCategories(
          transaction,
          productId,
          productData.categories
        );
      }

      // Handle classify data
      if (classifyData?.length > 0) {
        await ClassifyModel.updateProductClassify(
          transaction,
          productId,
          classifyData
        );
      }

      // Commit transaction
      await transaction.commit();

      return await ProductModel.getProductByField(transaction, "id", productId);
    } catch (error) {
      await transaction.rollback();
      console.error("Không cập nhật được sản phẩm: ", error);
      throw new Error("Không cập nhật được sản phẩm");
    } finally {
      transaction.release();
    }
  },

  deleteProduct: async (id) => {
    try {
      // Xóa đồng thời các liên kết
      await Promise.all([
        categoryProductModel.removeProductCategoryByProductId(connection, id),
        ProductTechnologyModel.deleteProductTechnologyByProductId(
          connection,
          id
        ),
        ImageModel.deleteImageByField(connection, "product_id", id),
        ClassifyModel.deleteClassify(connection, id),
      ]);

      // Xóa sản phẩm sau khi đã xóa tất cả các liên kết
      await ProductModel.deleteProduct(connection, id);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("Không xóa được sản phẩm: ", error);
      throw new Error("Không tìm thấy sản phẩm với id này");
    } finally {
      connection.release(); // Giải phóng kết nối
    }
    return { message: "Xóa sản phẩm thành công" };
  },

  getProductBySlug: async (slug_product) => {
    try {
      // Lấy thông tin sản phẩm dựa trên slug
      const product = await ProductModel.getProductByField(
        connection,
        "slug",
        slug_product
      );

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      // Thực hiện đồng thời các truy vấn khác
      const [categories, classify, images, technologies] = await Promise.all([
        categoryProductModel.getCategoriesByProductId(connection, product.id),
        ClassifyModel.getClassifyByField(connection, "product_id", product.id),
        ImageModel.getImageByField(connection, "product_id", product.id),
        ProductTechnologyModel.getTechnologiesByProductId(
          connection,
          product.id
        ),
      ]);

      // Gán dữ liệu vào đối tượng sản phẩm
      product.images = images;
      product.categories = categories;
      product.technologies = technologies;
      product.classify = classify;

      return product;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw new Error("Có lỗi xảy ra khi lấy thông tin sản phẩm");
    }
  },

   async getList(data) {
    const { pagingParams, filterParams } = data;
    const { orderBy, keyword, pageIndex, isPaging, pageSize } = pagingParams;
    const { categories, technologies, is_popular, priceRange } = filterParams;

    const validSortFields = ["price", "name"];
    const validOrderFields = ["asc", "desc"];

    let query = 'SELECT DISTINCT p.* FROM product p';
    let countQuery = 'SELECT COUNT(DISTINCT p.id) as totalCount FROM product p';
    let conditions = [];
    let joins = [];
    let params = [];

    if (categories?.length > 0) {
      joins.push('INNER JOIN products_categories pc ON p.id = pc.product_id');
      conditions.push('pc.category_id IN (?)');
      params.push(categories);
    }

    if (technologies?.length > 0) {
      joins.push('INNER JOIN products_technologies pt ON p.id = pt.product_id');
      conditions.push('pt.technology_id IN (?)');
      params.push(technologies);
    }

    if (keyword) {
      conditions.push('p.name LIKE ?');
      params.push(`%${keyword}%`);
    }

    if (priceRange) {
      conditions.push('p.price BETWEEN ? AND ?');
      params.push(priceRange.minPrice, priceRange.maxPrice);
    }

    if (is_popular === 1) {
      conditions.push('p.is_popular = 1');
    }

    const joinClause = joins.join(' ');
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    query += ` ${joinClause} ${whereClause}`;
    countQuery += ` ${joinClause} ${whereClause}`;

    if (orderBy) {
      const [sortField, sortOrder] = orderBy.split(':');
      if (validSortFields.includes(sortField) && validOrderFields.includes(sortOrder)) {
        query += ` ORDER BY ${mysql.escapeId(sortField)} ${sortOrder}`;
      } else {
        throw new Error('Tham số sắp xếp không hợp lệ');
      }
    }

    if (isPaging) {
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), (parseInt(pageIndex) - 1) * parseInt(pageSize));
    }

    try {
      const [totalCountRows] = await connection.query(countQuery, params);
      const totalCount = totalCountRows[0].totalCount;
      const totalPage = Math.ceil(totalCount / pageSize);

      const [rows] = await connection.query(query, params);

      return {
        data: rows,
        meta: { total: totalCount, totalPage: totalPage },
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw new Error('Có lỗi xảy ra khi lấy danh sách sản phẩm');
    }
  },

  addImage: async (data) => {
    const result = await ImageModel.addImage(connection, data);
    return result;
  },
  updateImage: async (data) => {
    const result = await ImageModel.updateImage(connection, data);
    return result;
  },
  deleteImage: async (id) => {
    const result = await ImageModel.deleteImage(connection, id);
    return result;
  },
  getImage: async (id) => {
    const result = await ImageModel.getImage(connection, id);
    return result;
  },
};

// Hàm xử lý categories
async function handleCategories(transaction, productId, categories) {
  await Promise.all(
    categories.map(async (categoryId) => {
      const category = await CategoryModel.getCategoryByField(
        transaction,
        "id",
        categoryId
      );
      if (!category) {
        throw new Error("Không tìm thấy danh mục sản phẩm");
      }
      const existingRelationship =
        await categoryProductModel.getRelationshipByProductIdAndCategoryId(
          transaction,
          productId,
          categoryId
        );
      if (!existingRelationship) {
        await categoryProductModel.addProductCategory(
          transaction,
          productId,
          categoryId
        );
      }
    })
  );
}

// Hàm xử lý technologies
async function handleTechnologies(transaction, productId, technologies) {
  await Promise.all(
    technologies.map(async (technologyId) => {
      const exitTechnology = await TechnologyModel.getTechnologyByField(
        transaction,
        "id",
        technologyId
      );
      if (!exitTechnology) {
        throw new Error("Không tìm thấy công nghệ sản phẩm");
      }
      await ProductTechnologyModel.addProductTechnology(
        transaction,
        productId,
        technologyId
      );
    })
  );
}

// Hàm xử lý images
async function handleImages(transaction, productId, images) {
  if (images && images.length > 0) {
    await Promise.all(
      images.map((image) =>
        ImageModel.addImage(transaction, { product_id: productId, url: image })
      )
    );
  }
}

// Hàm xử lý classify data
async function handleClassifyData(transaction, productId, classifyData) {
  const classifyDataArray = classifyData.map((classify) => ({
    ...classify,
    product_id: productId,
  }));
  await Promise.all(
    classifyDataArray.map((classify) =>
      ClassifyModel.addClassify(transaction, productId, classify)
    )
  );
}

export default ProductServices;
