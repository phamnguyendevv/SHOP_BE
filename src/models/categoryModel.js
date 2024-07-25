import ErrorWithStatus from "../utils/error.js";

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

  getCategoryByField: async (connection, field, value) => {
    const query = `SELECT * FROM \`categories\` WHERE ${field} = ?`;
    const [rows, fields] = await connection.execute(query, [value]);
    return rows[0];
  },

  // add new category
  addCategory: async (connection, category) => {
    // Thực hiện truy vấn INSERT
    try {
      const [result] = await connection.execute(
        "INSERT INTO categories (name, slug, is_popular, image, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [
          category.name,
          category.slug || null, // Sử dụng null nếu giá trị không được chỉ định
          category.is_popular || false,
          category.image || null,
        ]
      );
      const categoryId = result.insertId;

      // Truy vấn SELECT để trả về thông tin của category mới
      const [rows] = await connection.execute(
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

  //update category
  updateCategory: async (connection, category) => {
    const fieldsToUpdate = [];
    const params = [];

    if (category.name !== undefined) {
      fieldsToUpdate.push("name = ?");
      params.push(category.name);
    }
    if (category.image !== undefined) {
      fieldsToUpdate.push("image = ?");
      params.push(category.image);
    }
    if (category.popular !== undefined) {
      fieldsToUpdate.push("popular = ?");
      params.push(category.popular);
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error("Không có trường nào được cập nhật");
    }

    params.push(category.id);

    const fieldsToUpdateString = fieldsToUpdate.join(", ");
    console.log(fieldsToUpdateString);
    const query = `UPDATE categories SET ${fieldsToUpdateString}, updated_at = CURRENT_DATE WHERE id = ?`;

    const result = await connection.execute(query, params);

    return result;
  },

  //delete category
  deleteCategory: async (connection, id) => {
    //get category by caterogy id

    const result = await connection.execute(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );
    return result;
  },
};

export default CategoryModel;
