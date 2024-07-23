import Connection from "../db/configMysql.js";
const connection = await Connection();
import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import getSlug from "speakingurl";
import crypto from "crypto";
import { clearScreenDown } from "readline";
import CategoryService from "./categoryServices.js";
import categoryProdcutModel from "../models/categoryProductModel.js";

let ProductServices = {
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: "vn" });

    let fullSlug, existingCategory;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}-${randomInt}`;
      existingCategory = await ProductModel.findProductBySlug(
        connection,
        fullSlug
      );
    } while (!existingCategory);
    return fullSlug;
  },

  //addProduct
  addProduct: async (data) => {
    const { productData, classifyData } = data;

    // Generate slug for the product
    const slug_product = await ProductServices.createSlug(productData.name);
    productData.slug_product = slug_product;

    // Add product to the database
    const newProduct = await ProductModel.addProduct(connection, productData);
    const productId = newProduct.insertId;

    // Handle categories
    const categoryPromises = productData.categories.map(
      async (nameCategory) => {
        let category = await CategoryModel.getCategoryByField(
          connection,
          "name",
          nameCategory
        );

        if (!category) {
          // Add category if it doesn't exist
          const newCategory = await CategoryService.addCategory({
            name: nameCategory,
          });
          category = newCategory;
        }

        // Add product-category relationship
        await ProductModel.addProductCategory(
          connection,
          productId,
          category.id
        );
      }
    );

    await Promise.all(categoryPromises);

    // Prepare classify data and insert into database
    const classifyDataArray = classifyData.map((classify) => ({
      ...classify,
      product_id: productId,
    }));
    const classifyPromises = classifyDataArray.map((classify) =>
      ProductModel.addClassify(connection, classify)
    );
    await Promise.all(classifyPromises);

    return newProduct;
  },

  updateProduct: async (data) => {
    const { productData, classifyData } = data;
    
    const productId = productData.id;
    // Generate slug for the product if the name is being updated
    if (productData.name) {
      const slug = await ProductServices.createSlug(productData.name);
      productData.slug = slug;
    }
    // Update product in the database
    await ProductModel.updateProduct(connection, productData);

    // Handle categories
    if (productData.categories && productData.categories.length > 0) {
      const existingCategories = await categoryProdcutModel.getCategoriesByProductId(
        connection,
        productId
      );
      // Find categories to add and to remove
      const categoriesToAdd = productData.categories.filter(
        (nameCategory) =>
          !existingCategories.some(
            (existingCategory) => existingCategory.name === nameCategory
          )
      );
      
      const categoriesToRemove = existingCategories.filter(
        (existingCategory) =>
          !productData.categories.includes(existingCategory.name)
      );
      

      // Remove product-category relationships
      const removeCategoryPromises = categoriesToRemove.map((category) =>
        ProductModel.removeProductCategory(connection, productId, category.id)
      );

      await Promise.all(removeCategoryPromises);

      // Add new categories and their relationships
      const addCategoryPromises = categoriesToAdd.map(async (nameCategory) => {
        let category = await CategoryModel.getCategoryByField(
          connection,
          "name",
          nameCategory
        );

        if (!category) {
          // Add category if it doesn't exist
          category = await CategoryService.addCategory({ name: nameCategory });
        }

        // Add product-category relationship
        await ProductModel.addProductCategory(
          connection,
          productId,
          category.id
        );
      });

      await Promise.all(addCategoryPromises);
    }

    // Prepare classify data and update or insert into database
    console.log("classifyData", classifyData);
    if (classifyData && classifyData.length > 0) {
      const existingClassifyData = await ProductModel.findClassifyById(
        connection,
        classifyData.id
      );

      // Update existing classify data and add new ones
      const updateClassifyPromises = classifyData.map((classify) => {
        if (
          existingClassifyData.some((existing) => existing.id === classify.id)
        ) {
          // Update existing classify
          return ProductModel.updateClassify(connection, classify.id, classify);
        } else {
          // Add new classify
          classify.product_id = productId;
          return ProductModel.addClassify(connection, classify);
        }
      });

      await Promise.all(updateClassifyPromises);
    }

    return await ProductModel.getProductById(connection, productId);
  },

  deleteProduct: async (id) => {
    try {
      console.log("id", id);
      const resultClassify = await ProductModel.deleteClassify(connection, id);
      const result = await ProductModel.deleteProduct(connection, id);
    } catch (error) {
      console.error("Không xóa được sản phẩm: ", error);
      throw new Error("Không tìm thấy sản phẩm với id này");
    }

    return { message: "Xóa sản thành công" };
  },

  getProductBySlug: async (slug_product) => {
    const product = await ProductModel.getProductBySlug(
      connection,
      slug_product
    );
    const classify = await ProductModel.getClassifyByProduct(
      connection,
      product.id
    );
    const result = { product, classify };
    return result;
  },

  // --------------------------------------------product Popular--------------------------------------------

  getList: async (data) => {
    const { pagingParams, filterParams } = data;
    const { orderBy, keyword, pageIndex, isPaging, pageSize, priceRange } =
      pagingParams;
    const { categories, technology, is_popular } = filterParams;

    // Construct the SQL query
    let query = "SELECT * FROM product WHERE ";
    let conditions = [];

    // Add conditions for filtering
    if (categories && categories.length > 0) {
      conditions.push(
        `JSON_CONTAINS(categories, JSON_ARRAY(${categories
          .map((cat) => connection.escape(cat))
          .join(",")}))`
      );
    }
    if (technology && technology.length > 0) {
      conditions.push(
        `JSON_CONTAINS(technology, JSON_ARRAY(${technology
          .map((tec) => connection.escape(tec))
          .join(",")}))`
      );
    }
    if (keyword) {
      conditions.push(`name_product LIKE '%${keyword}%'`);
    }
    if (priceRange) {
      conditions.push(
        `price >= ${priceRange.minPrice} AND price <= ${priceRange.maxPrice}`
      );
    }
    if (is_popular === 1) {
      conditions.push(`is_popular = 1`);
    }
    // Apply conditions
    if (conditions.length > 0) {
      query += conditions.join(" AND ");
    } else {
      // If no filters are applied, select all products
      query += "1";
    }
    // Apply ordering
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    // Apply paging
    if (isPaging) {
      const offset = (pageIndex - 1) * pageSize;
      query += ` LIMIT ${pageSize} OFFSET ${offset}`;
    }

    const totalCountQuery =
      "SELECT COUNT(*) as totalCount FROM product WHERE " +
      (conditions.length > 0 ? conditions.join(" AND ") : "1");
    const [totalCountRows, totalCountFields] = await connection.query(
      totalCountQuery
    );
    const totalCount = totalCountRows[0].totalCount;

    // Calculate total pages
    const totalPage = Math.ceil(totalCount / pageSize);

    // Execute main query to get data
    const [rows, fields] = await connection.query(query);

    return { data: rows, meta: { total: totalCount, totalPage: totalPage } };
  },
};

export default ProductServices;
