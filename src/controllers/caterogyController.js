import CategoryService from '../services/categoryServices.js';


let categoryController = {
    // add new category
    addCategory: async (req, res) => {
      
        const result = await CategoryService.addCategory(req.body)
        return res.json({
            message: 'Add new category successfully!',
            result
        })
    },


    //get all categories
    getAllCategories: async (req, res) => {
        const result = await CategoryService.getAllCategories(req.body)
        return res.json({
            message: 'Get all categories successfully!',
            result
        })
    },

    //update category
    updateCategory: async (req, res) => {
    
        const result = await CategoryService.updateCategory(req.body)
        return res.json({
            message: `Danh mục có id ${req.body.id} đã được cập nhật`
        })
    },
    //deleteCategory
    deleteCategory: async (req, res) => {
        const { id } = req.query
        const result = await CategoryService.deleteCategory(id)
        return res.json({
            message: 'Delete category successfully!',
        })
    }

}


export default categoryController;