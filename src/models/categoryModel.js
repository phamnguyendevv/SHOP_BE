import ErrorWithStatus from "../utils/error.js";
import Connection from "../db/configMysql.js";
let CategoryModel = {
  //get category by id
  getCategoryById: async (connection, id) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `category` WHERE id = ?",
      [id]
    );
    return rows[0];
  },
  //get category by slug
  getCategoryBySlug: async (connection, slug) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `categories` WHERE slug_categories = ?",
      [slug]
    );
    return rows[0];
  },
  getCategoryByName: async (connection, name) => {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `categories` WHERE name = ?",
      [name]
    );
    return rows;
  },

  getCategoryByField: async (field, value) => {
    const query = `SELECT * FROM \`categories\` WHERE ${field} = ?`;
    const results = await Connection.execute(query, [value]);
    return results;
  },

  // add new category
  addCategory: async (data) => {
    // Thực hiện truy vấn INSERT
    try {
    
      const result = await Connection.execute(
        "INSERT INTO categories (name, slug, description,is_popular, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [
          data.name,
          data.slug || null, // Sử dụng null nếu giá trị không được chỉ định
          data.description ,
          data.is_popular || false,
          data.image || null,
        ]
      );
      const categoryId = result.insertId;

      // Truy vấn SELECT để trả về thông tin của category mới
      const rows = await Connection.execute(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId]
      );

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  //get all category
  getAllCategories: async (connection) => {
    try {
      const categories = await connection.execute("SELECT * FROM `categories`");
      return categories;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error("Error in getAllCategories");
    }
  },

  getCategoryList: async (connection) => {
    try {
      const categories = await connection.execute(
        "SELECT id, name, slug, image FROM `categories`"
      );
      return categories;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error("Error in getCategoryList");
    }
  },

  //update category
  updateCategory: async (data) => {
    try {
      const fieldsToUpdate = [];
      const params = [];

      if (data.name !== undefined) {
        fieldsToUpdate.push("name = ?");
        params.push(data.name);
      }
      if (data.image !== undefined) {
        fieldsToUpdate.push("image = ?");
        params.push(data.image);
      }
      if (data.description !== undefined) {
        fieldsToUpdate.push("description = ?");
        params.push(data.description);
      }
      if (data.is_popular !== undefined) {
        fieldsToUpdate.push("is_popular = ?");
        params.push(parseInt(data.is_popular));
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error("Không có trường nào được cập nhật");
      }

      params.push(parseInt(data.id));

      const fieldsToUpdateString = fieldsToUpdate.join(", ");
      const query = `UPDATE categories SET ${fieldsToUpdateString}, updated_at = CURRENT_DATE WHERE id = ?`;
      console.log(query);
      console.log(params);
      const result = await Connection.execute(query, params);

      return result;
    } catch (error) {
      console.log(error);
    }
  },

  //delete category
  deleteCategory: async (id) => {
    //get category by caterogy id

    const result = await Connection.execute(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );
    return result;
  },
};

export default CategoryModel;
