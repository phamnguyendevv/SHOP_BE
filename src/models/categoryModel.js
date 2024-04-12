import ErrorWithStatus from '../utils/error.js';


let CategoryModel = {
  //get category by id
  getCategoryById: async (connection, id) => {

    try {
      const [rows] = await connection.execute('SELECT * FROM `category` WHERE id = ?', [id]);
      return rows;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error('Không tìm thấy sản phẩm với id này');
    }
  },
  //get category by slug
  getCategoryBySlug: async (connection, slug) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM `category` WHERE slug = ?', [slug]);
      return rows;
    } catch (error) {
      // Xử lý lỗi ở đây
      throw new Error('Không tìm thấy sản phẩm với slug này');
    }
  },


  // add new category
  addCategory: async (connection, category) => {
    // Thực hiện truy vấn INSERT
    const [rows] = await connection.execute(
      'INSERT INTO category (product_id, name, slug, popular, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        category.product_id,
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
    console.log(body);
    //get category by caterogy id
    const [rows] = await connection.execute('SELECT * FROM `category` WHERE id = ?', [body.id]);
    if (rows.length === 0) {
      throw new Error('Danh mục không tồn tại');
    }

    const result = await connection.execute(
      'UPDATE category SET name = ?, image = ?, updated_at = ? WHERE id = ?',
      [
        body.name,
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