let CategoryModel = {



    //get all categories
    getAllCategories: async (connection) => {
        try {
            const categories = await connection.execute('SELECT * FROM `categories`');
            return categories[0];
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in getAllCategories:', error);
            throw error;
        }
    },
  
}


export default CategoryModel;