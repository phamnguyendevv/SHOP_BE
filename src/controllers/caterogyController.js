import { stat } from 'fs';
import CategoryService from '../services/categoryServices.js';


let categoryController = {
  // add new category
  addCategory: async (req, res) => {
    const result = await CategoryService.addCategory(req.body);
    return res.json({
      message: "Add new category successfully!",
      result,
    });
  },
  //update category
  updateCategory: async (req, res) => {
    const result = await CategoryService.updateCategory(req.body);
    return res.json({
      message: `Danh mục có id ${req.body.id} đã được cập nhật`,
    });
  },
  //deleteCategory
  deleteCategory: async (req, res) => {
    const { id } = req.query;
    const result = await CategoryService.deleteCategory(id);
    return res.json({
      message: "Xóa danh mục thành công!",
    });
  },
    getCategoryList: async (req, res) => {
        const result = await CategoryService.getCategoryList(req.body);
        return res.json({
            message: "Lấy danh mục thành công!",
            data: result,
            status: 200,
        });
    }

};


export default categoryController;