import ErrorWithStatus from '../utils/error.js';


let CategoryModel = {
  //get category by id
  getCategoryById: async (connection, id) => {
    const [rows] = await connection.execute('SELECT * FROM `category` WHERE id = ?', [id]);
    
    return rows[0];
  },
  

  // add new category
  addCategory: async (connection, category) => {
      // Thực hiện truy vấn INSERT
      const [rows] = await connection.execute(
        'INSERT INTO category (user_id, name, slug, popular, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          category.user_id,
          category.name,
          category.slug || '', // Sử dụng || '' để đảm bảo giá trị không null
          category.popular || false, // Sử dụng || false để đảm bảo giá trị không null
          category.image,
          new Date(),
          new Date()
        ]
      );
      console.log(`Danh mục mới đã được thêm với id ${rows.insertId}`);
      console.log(rows.insertId);
      return rows.insertId;
  },

  //get all category
  getAllCategories: async (connection) => {
    try {
      const categories = await connection.execute('SELECT * FROM `category`');
      return categories;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error('Error in getAllCategories');

    }
  },

  //update category
  updateCategory: async (connection, body) => {
      //get category by caterogy id
      const [rows] = await connection.execute('SELECT * FROM `category` WHERE id = ?', [body.id]);
      if (rows.length === 0) {
        throw new Error('Danh mục không tồn tại');
      }

      const result = await connection.execute(
        'UPDATE category SET name = ?, slug = ?, popular = ?, image = ?, updated_at = ? WHERE id = ?',
        [
          body.name,
          body.slug,
          body.popular,
          body.image,
          body.updated_at || new Date(),
          body.id
        ]
      );
      
      return result;
  },

  //delete category
  deleteCategory: async (connection, body) => {
      //get category by caterogy id
      const [rows] = await connection.execute('SELECT * FROM `category` WHERE id = ?', [body.id]);
      if (rows.length === 0) {
        throw new Error("Danh mục không tồn tại");

      }
      const result = await connection.execute('DELETE FROM category WHERE id = ?', [body.id]);
      return result;
  }
}


export default CategoryModel;