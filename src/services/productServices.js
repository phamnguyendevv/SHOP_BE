import mysql from "mysql2";
import crypto from "crypto";
import getSlug from "speakingurl";
// import redis from "../db/configRedis.js";
import Connection from "../db/configMysql.js";
import ImageModel from "../models/imageModel.js";
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import ClassifyModel from "../models/classifyModel.js";
import TechnologyModel from "../models/technologyModel.js";
import categoryProductModel from "../models/categoryProductModel.js";
import ProductTechnologyModel from "../models/productTechnologyMode.js";
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
    const {
      createdAt,
      updatedAt,
      images,
      categories,
      technologies,
      ...updateDataProduct
    } = productData;
    try {
      await Connection.executeTransaction(async (connection) => {
        await updateCategories(connection, productId, productData.categories);
        await updateTechnologies(
          connection,
          productId,
          productData.technologies
        );
        await updateClassify(connection, productId, classifyData);
        await updateImages(connection, productId, productData.images);
        await connection.query(`UPDATE product SET ? WHERE id = ?`, [
          updateDataProduct,
          productId,
        ]);
      });
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
    const productKey = `product:${slug_product}`;
    // const cachedProduct = await redis.get(productKey);
    // if (cachedProduct) {
    //   const parsedProduct = JSON.parse(cachedProduct);
    //   if (parsedProduct && Object.keys(parsedProduct).length > 0) {
    //     console.log("Lấy sản phẩm từ cache");
    //     return parsedProduct;
    //   }
    // }

    // Nếu không có trong cache, lấy từ database
    console.log("Lấy sản phẩm từ database");
    const product = await ProductModel.getProductByField("slug", slug_product);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Thực hiện đồng thời các truy vấn khác
    const [categories, classify, images, technologies] = await Promise.all([
      categoryProductModel.getCategoriesByProductId(product.id),
      ClassifyModel.getClassifyByField("product_id", product.id),
      ImageModel.getImageByField("product_id", product.id),
      ProductTechnologyModel.getTechnologiesByProductId(product.id),
    ]);

    // Gán dữ liệu vào đối tượng sản phẩm
    const enrichedProduct = {
      ...product,
      images,
      categories,
      technologies,
      classify: classify.map(({ id, price, name, description }) => ({
        id,
        price,
        name,
        description,
      })),
    };

    // Lưu sản phẩm vào Redis
    // await redis.set(productKey, JSON.stringify(enrichedProduct), "EX", 7200);

    return enrichedProduct;
  },

  getList: async (data) => {
    const { pagingParams, filterParams } = data;
    const { orderBy, keyword, pageIndex, isPaging, pageSize } = pagingParams;
    const { categories, technologies, is_popular, priceRange, user_id } =
      filterParams;

    // Tạo một key duy nhất cho truy vấn này
    const cacheKey = `products:${JSON.stringify({
      pagingParams,
      filterParams,
    })}`;
    // Kiểm tra cache trước
    // const cachedResult = await redis.get(cacheKey);
    // if (cachedResult) {
    //   console.log("Returning result from cache");
    //   return JSON.parse(cachedResult);
    // }

    const baseQuery = `
    SELECT  DISTINCT p.*, i.url as image, u.full_name as user_name,
    c_min.price as price_min
    FROM product p
    LEFT JOIN images i ON p.id = i.product_id AND i.type = 1
    LEFT JOIN classify c_min ON p.id = c_min.product_id AND c_min.price = (
        SELECT MIN(price) FROM classify WHERE product_id = p.id
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
    const fullQuery = `${baseQuery} ${whereClause} ${orderClause} ${limitClause}`;
    try {
      const [totalCountRows, rows] = await Promise.all([
        connection.query(`${countQuery} ${whereClause}`, params),
        connection.query(fullQuery, params),
      ]);

      const totalCount = totalCountRows[0][0].totalCount;
      const totalPage = Math.ceil(totalCount / pageSize);

      const result = {
        data: rows[0],
        meta: { total: totalCount, totalPage },
      };

      // Cache kết quả trong 5 phút
      // await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

      return result;
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
  const technologiesToRemove = existingTechnologies.filter(
    (existingTech) => !technologies.includes(existingTech.id)
  );

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
    conditions.push("(c_min.price >= ? AND c_min.price <= ?)");
    params.push(priceRange.minPrice, priceRange.maxPrice);
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

async function updateCategories(connection, productId, categories) {
  const existingCategories =
    await categoryProductModel.getCategoriesByProductId(productId);

  // Tìm các danh mục cần thêm
  const categoriesToAdd = categories.filter(
    (newCat) =>
      !existingCategories.some((existingCat) => existingCat.id === newCat)
  );

  // Tìm các danh mục cần xóa
  const categoriesToRemove = existingCategories.filter(
    (existingCat) => !categories.includes(existingCat.id)
  );

  // Thêm các danh mục mới
  await Promise.all(
    categoriesToAdd.map(async (catId) => {
      const category = await CategoryModel.getCategoryByField("id", catId);
      if (!category) throw new Error("Không tìm thấy danh mục sản phẩm");
      return connection.query(
        `INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)`,
        [productId, catId]
      );
    })
  );

  // Xóa các danh mục cũ
  await Promise.all(
    categoriesToRemove.map((cat) =>
      connection.query(
        `DELETE FROM products_categories WHERE product_id = ? AND category_id = ?`,
        [productId, cat.id]
      )
    )
  );
}

async function updateTechnologies(connection, productId, technologies) {
  const existingTechnologies =
    await ProductTechnologyModel.getTechnologiesByProductId(productId);

  // Tìm các công nghệ cần thêm
  const technologiesToAdd = technologies.filter(
    (newTech) =>
      !existingTechnologies.some((existingTech) => existingTech.id === newTech)
  );

  // Tìm các công nghệ cần xóa
  const technologiesToRemove = existingTechnologies.filter(
    (existingTech) => !technologies.includes(existingTech.id)
  );

  // Thêm các công nghệ mới
  await Promise.all(
    technologiesToAdd.map(async (techId) => {
      const technology = await TechnologyModel.getTechnologyByField(
        "id",
        techId
      );
      if (!technology) throw new Error("Không tìm thấy công nghệ sản phẩm");
      return connection.query(
        `INSERT INTO products_technologies (product_id, technology_id) VALUES (?, ?)`,
        [productId, techId]
      );
    })
  );

  // Xóa các công nghệ cũ
  await Promise.all(
    technologiesToRemove.map((tech) =>
      connection.query(
        `DELETE FROM products_technologies WHERE product_id = ? AND technology_id = ?`,
        [productId, tech.id]
      )
    )
  );
}

async function updateClassify(connection, productId, classifyData) {
  console.log("classifyData", classifyData);
  const existingClassifies = await ClassifyModel.getClassifyByField(
    "product_id",
    productId
  );

  // Tìm các phân loại cần thêm
  const classifiesToAdd = classifyData.filter(
    (newClassify) =>
      !existingClassifies.some(
        (existingClassify) => existingClassify.id === newClassify.id
      )
  );

  // Tìm các phân loại cần cập nhật
  const classifiesToUpdate = classifyData.filter((newClassify) =>
    existingClassifies.some(
      (existingClassify) => existingClassify.id === newClassify.id
    )
  );

  // Tìm các phân loại cần xóa
  const classifiesToRemove = existingClassifies.filter(
    (existingClassify) =>
      !classifyData.some(
        (newClassify) => newClassify.id === existingClassify.id
      )
  );

  // Thêm các phân loại mới
  await Promise.all(
    classifiesToAdd.map(async (classify) => {
      classify.product_id = productId;
      return connection.query(
        `INSERT INTO classify (product_id, price, name, url_download,description) VALUES (?, ?, ?, ?, ?)`,
        [
          productId,
          classify.price,
          classify.name,
          classify.urldownload,
          classify.description,
        ]
      );
    })
  );

  // Cập nhật các phân loại cũ
  await Promise.all(
    classifiesToUpdate.map(async (classify) => {
      const existingClassify = await ClassifyModel.getClassifyByField(
        "id",
        classify.id
      );
      if (existingClassify) {
        return connection.query(
          `UPDATE classify SET ? WHERE product_id = ? AND id = ?`,
          [classify, productId, classify.id]
        );
      }
    })
  );

  // Xóa các phân loại cũ
  await Promise.all(
    classifiesToRemove.map((classify) =>
      connection.query(`DELETE FROM classify WHERE product_id = ? AND id = ?`, [
        productId,
        classify.id,
      ])
    )
  );
}

async function updateImages(connection, productId, images) {
  if (!images || images.length === 0) return; // Skip if images is empty or undefined
  const existingImages = await ImageModel.getImageByField(
    "product_id",
    productId
  );
  const imagesToAdd = images.filter(
    (newImage) =>
      !existingImages.some((existingImg) => existingImg.url === newImage)
  );

  const imagesToRemove = existingImages.filter(
    (existingImg) => !images.includes(existingImg.url)
  );

  // Add new images
  await Promise.all(
    imagesToAdd.map(async (url, index) => {
      const image = {
        product_id: productId,
        url: url,
        type: index === 0 ? 1 : 0, // First image is set as type 1, others as type 0
      };
      await connection.query(
        `INSERT INTO images (product_id, url, type) VALUES (?, ?, ?)`,
        [image.product_id, image.url, image.type]
      );
    })
  );

  // Remove old images
  await Promise.all(
    imagesToRemove.map(async (image) => {
      await connection.query(
        `DELETE FROM images WHERE product_id = ? AND id = ?`,
        [image.product_id, image.id]
      );
    })
  );
}

export default ProductServices;
