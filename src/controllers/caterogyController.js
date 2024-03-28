import CategoryService from '../services/categoryServices.js';


let categoryController = {
    //get all categories
    getAllCategories: async (req, res) => {
        const result = await CategoryService.getAllCategories(req.body)
        return res.json({
            message: 'User created',
            result
        })
    }
}


export default categoryController;