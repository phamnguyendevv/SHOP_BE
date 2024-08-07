import mysql from "mysql2";
import getSlug from "speakingurl";
import crypto from "crypto";
import CategoryService from "./categoryServices.js";
import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import ClassifyModel from "../models/classifyModel.js";
import TechnologyModel from "../models/technologyModel.js";
import categoryProductModel from "../models/categoryProductModel.js";
import categoryProdcutModel from "../models/categoryProductModel.js";
import ProductTechnologyModel from "../models/productTechnologyMode.js";
import ImageModel from "../models/imageModel.js";
import Connection from "../db/configMysql.js";
const connection = await Connection.getConnection();

let ProductServices = {
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: "vn" });
    let fullSlug, existingProductSlug;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}-${randomInt}`;
      existingProductSlug = await ProductModel.getProductByField(
        "slug",
        fullSlug
      );
    } while (existingProductSlug);
    return fullSlug;
  },

  addProduct: async (data) => {
    const { productData, classifyData } = data;
    return await Connection.executeTransaction(async (callback) => {
      try {
        // Generate slug và thêm sản phẩm
        productData.slug = await ProductServices.createSlug(productData.name);
        const newProduct = await ProductModel.addProduct(productData);
        const productId = newProduct.insertId;

        // Xử lý categories, technologies, và images
        await Promise.all([
          handleCategories(productId, productData.categories),
          handleTechnologies(productId, productData.technologies),
          handleImages(productId, productData.images),
        ]);

        // Xử lý classify data
        if (!classifyData || classifyData.length === 0) {
          throw new Error("Không tìm thấy phân loại sản phẩm");
        }
        await handleClassifyData(productId, classifyData);

        return newProduct;
      } catch (error) {
        throw error;
      }
    });
  },

  updateProduct: async (data) => {
    const { productData, classifyData } = data;
    const productId = Number(productData.id);

    try {
      // Update product
      await ProductModel.updateProduct(productData);

      // Handle categories
      if (productData.categories?.length > 0) {
        await updateProductCategories(productId, productData.categories);
      }
      if (productData.technologies?.length > 0) {
        await handleTechnologies(productId, productData.technologies);
      }
      // Handle classify data
      if (classifyData?.length > 0) {
        await updateProductClassify(productId, classifyData);
      }
      if (productData.images?.length > 0) {
        await handleUpdateImages(productId, productData.images);
      }

      return await ProductModel.getProductByField("id", productId);
    } catch (error) {
      console.error("Không cập nhật được sản phẩm: ", error);
      throw new Error("Không cập nhật được sản phẩm");
    }
  },

  deleteProduct: async (id) => {
    try {
      // Xóa đồng thời các liên kết
      await Promise.all([
        categoryProductModel.removeProductCategoryByProductId(id),
        ProductTechnologyModel.deleteProductTechnologyByProductId(id),
        ImageModel.deleteImageByField("product_id", id),
        ClassifyModel.deleteClassifyByFild("product_id", id),
      ]);
      // Xóa sản phẩm sau khi đã xóa tất cả các liên kết
      await ProductModel.deleteProduct(id);
    } catch (error) {
      console.error("Không xóa được sản phẩm: ", error);
      throw new Error("Không tìm thấy sản phẩm với id này");
    }
    return { message: "Xóa sản phẩm thành công" };
  },

  getProductBySlug: async (slug_product) => {
    try {
      // Lấy thông tin sản phẩm dựa trên slug
      const product = await ProductModel.getProductByField(
        "slug",
        slug_product
      );

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }
      // Thực hiện đồng thời các truy vấn khác
      const [categories, classify, images, technologies] = await Promise.all([
        categoryProductModel.getCategoriesByProductId(product.id),
        ClassifyModel.getClassifyByField("product_id", product.id),
        ImageModel.getImageByField("product_id", product.id),
        ProductTechnologyModel.getTechnologiesByProductId(product.id),
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

  getList: async (data) => {
    const { pagingParams, filterParams } = data;
    const { orderBy, keyword, pageIndex, isPaging, pageSize } = pagingParams;
    const { categories, technologies, is_popular, priceRange, user_id } =
      filterParams;

    const baseQuery = `
    SELECT  DISTINCT p.*, i.url as image, u.full_name as user_name,
    c_min.price as price_min, c_max.price as price_max
    FROM product p
    LEFT JOIN images i ON p.id = i.product_id AND i.type = 1
    LEFT JOIN classify c_min ON p.id = c_min.product_id AND c_min.price = (
        SELECT MIN(price) FROM classify WHERE product_id = p.id
    )
    LEFT JOIN classify c_max ON p.id = c_max.product_id AND c_max.price = (
        SELECT MAX(price) FROM classify WHERE product_id = p.id
    )
    LEFT JOIN user u ON p.user_id = u.id
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT p.id) as totalCount
    FROM product p
    LEFT JOIN images i ON p.id = i.product_id AND i.type = 1
    LEFT JOIN classify c_min ON p.id = c_min.product_id AND c_min.price = (
        SELECT MIN(price) FROM classify WHERE product_id = p.id
    )
    LEFT JOIN classify c_max ON p.id = c_max.product_id AND c_max.price = (
        SELECT MAX(price) FROM classify WHERE product_id = p.id
    )
    LEFT JOIN user u ON p.user_id = u.id
    `;

    const { conditions, params } = await buildQueryConditions({
      categories,
      technologies,
      keyword,
      priceRange,
      is_popular,
      user_id,
    });

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderClause = await buildOrderClause(orderBy);

    const limitClause = isPaging ? `LIMIT ? OFFSET ?` : "";
    if (isPaging) {
      params.push(
        parseInt(pageSize),
        (parseInt(pageIndex) - 1) * parseInt(pageSize)
      );
    }
    console.log(orderClause);
    console.log(whereClause);
    const fullQuery = `${baseQuery} ${whereClause} ${orderClause} ${limitClause}`;
    console.log(fullQuery);
    console.log(params);
    try {
      const totalCountRows = await Connection.query(
        `${countQuery}${whereClause}`,
        params
      );
      const totalCount = totalCountRows[0].totalCount;
      const totalPage = Math.ceil(totalCount / pageSize);

      const [rows] = await connection.query(fullQuery, params);

      return {
        data: rows,
        meta: { total: totalCount, totalPage },
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw new Error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
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
async function handleCategories(productId, categories) {
  await Promise.all(
    categories.map(async (categoryId) => {
      const category = await CategoryModel.getCategoryByField("id", categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục sản phẩm");
      }
      const existingRelationship =
        await categoryProductModel.getRelationshipByProductIdAndCategoryId(
          productId,
          categoryId
        );
      if (!existingRelationship) {
        await categoryProductModel.addProductCategory(productId, categoryId);
      }
    })
  );
}

async function handleTechnologies(productId, technologies) {
  const existingTechnologies =
    await ProductTechnologyModel.getTechnologiesByProductId(productId);

  const technologiesToAdd = technologies.filter(
    (newTech) =>
      !existingTechnologies.some((existingTech) => existingTech.id === newTech)
  );
  console.log("cần thêm", technologiesToAdd);
  const technologiesToRemove = existingTechnologies.filter(
    (existingTech) => !technologies.includes(existingTech.id)
  );
  console.log("cần xóa", technologiesToRemove);

  await Promise.all([
    ...technologiesToRemove.map((tech) =>
      ProductTechnologyModel.deleteProductTechnology(productId, tech.id)
    ),
    ...technologiesToAdd.map(async (techId) => {
      const technology = await TechnologyModel.getTechnologyByField(
        "id",
        techId
      );
      if (!technology) {
        throw new Error("Không tìm thấy công nghệ sản phẩm");
      }
      return ProductTechnologyModel.addProductTechnology(productId, techId);
    }),
  ]);
}

// Hàm xử lý images
async function handleImages(productId, images) {
  console.log(images);
  if (images && images.length > 0) {
    await Promise.all(
      images.map((image, index) =>
        ImageModel.addImage({
          product_id: productId,
          url: image,
          type: index === 0 ? 1 : 0,
        })
      )
    );
  }
}
async function handleUpdateImages(productId, images) {
  console.log(images);
  if (images && images.length > 0) {
    await Promise.all(
      images.map((image, index) =>
        ImageModel.updateImage({
          product_id: productId,
          url: image,
          type: index === 0 ? 1 : 0,
        })
      )
    );
  }
}

// Hàm xử lý classify data
async function handleClassifyData(productId, classifyData) {
  const classifyDataArray = classifyData.map((classify) => ({
    ...classify,
    product_id: productId,
  }));
  await Promise.all(
    classifyDataArray.map((classify) =>
      ClassifyModel.addClassify(productId, classify)
    )
  );
}
async function updateProductClassify(productId, classifyData) {
  const existingClassifies = await ClassifyModel.getClassifyByField(
    "product_id",
    productId
  );

  const classifiesToAdd = classifyData.filter(
    (newClassify) =>
      !existingClassifies.some(
        (existingClassify) => existingClassify.id === newClassify.id
      )
  );

  const classifiesToRemove = existingClassifies.filter(
    (existingClassify) =>
      !classifyData.some(
        (newClassify) => newClassify.id === existingClassify.id
      )
  );

  await Promise.all([
    ...classifiesToRemove.map((classify) =>
      ClassifyModel.deleteClassify(productId, classify.id)
    ),
    ...classifiesToAdd.map(async (classify) => {
      if (classify.id) {
        const existingClassify = await ClassifyModel.getClassifyByField(
          "id",
          classify.id
        );
        if (existingClassify) {
          return ClassifyModel.updateClassify(productId, classify);
        }
      }
      classify.product_id = productId;
      return ClassifyModel.addClassify(productId, classify);
    }),
  ]);
}

async function updateProductCategories(productId, newCategories) {
  const existingCategories =
    await categoryProductModel.getCategoriesByProductId(productId);

  const categoriesToAdd = newCategories.filter(
    (newCat) =>
      !existingCategories.some((existingCat) => existingCat.id === newCat)
  );
  const categoriesToRemove = existingCategories.filter(
    (existingCat) => !newCategories.includes(existingCat.id)
  );

  await Promise.all([
    ...categoriesToRemove.map((cat) =>
      categoryProductModel.removeProductCategory(productId, cat.id)
    ),
    ...categoriesToAdd.map(async (catId) => {
      const category = await CategoryModel.getCategoryByField("id", catId);
      if (!category) throw new Error("Không tìm thấy danh mục sản phẩm");
      return categoryProductModel.addProductCategory(productId, catId);
    }),
  ]);
}

async function buildQueryConditions({
  categories,
  technologies,
  keyword,
  priceRange,
  is_popular,
  user_id,
}) {
  console.log("buildQueryConditions is being called");
  const conditions = [];
  const params = [];

  if (categories && categories.length > 0) {
    conditions.push(
      "p.id IN (SELECT product_id FROM products_categories WHERE category_id IN (?))"
    );
    params.push(categories);
  }

  if (technologies && technologies.length > 0) {
    conditions.push(
      "p.id IN (SELECT product_id FROM products_technologies WHERE technology_id IN (?))"
    );
    params.push(technologies);
  }

  if (keyword) {
    conditions.push("p.name LIKE ?");
    params.push(`%${keyword}%`);
  }

  if (priceRange) {
    conditions.push(
      "(c_min.price >= ? AND c_max.price <= ?) OR (c_max.price BETWEEN ? AND ?)"
    );
    params.push(
      priceRange.minPrice,
      priceRange.maxPrice,
      priceRange.minPrice,
      priceRange.maxPrice
    );
  }

  if (is_popular === 1) {
    conditions.push("p.is_popular = 1");
  }

  if (user_id) {
    conditions.push("p.user_id = ?");
    params.push(user_id);
  }

  return { conditions, params };
}

async function buildOrderClause(orderBy) {
  const validSortFields = {
    price: "c_min.price",
    name: "name",
  };
  const validOrderFields = ["asc", "desc"];

  if (orderBy) {
    const [sortField, sortOrder] = orderBy.split(":");
    if (
      !validSortFields[sortField] ||
      !validOrderFields.includes(sortOrder.toLowerCase())
    ) {
      throw new Error("Tham số sắp xếp không hợp lệ");
    }

    const escapedSortField = validSortFields[sortField];
    return `ORDER BY ${mysql.escapeId(
      escapedSortField
    )} ${sortOrder.toUpperCase()}`;
  }
  return "";
}

export default ProductServices;
