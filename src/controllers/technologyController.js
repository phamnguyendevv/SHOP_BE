import { stat } from "fs";
import TechnologyService from "../services/technologyServices.js";

let technologyController = {
  // add new Technolog
  addTechnology: async (req, res) => {
    const result = await TechnologyService.addTechnology(req.body);
    return res.json({
      message: "Thêm công nghệ thành công!",
      data: result,
      status: 200,
    });
  },

  //update Technology
  updateTechnology: async (req, res) => {
    const result = await TechnologyService.updateTechnology(req.body);
    return res.json({
      message: `Công nghệ có id ${req.body.id} đã được cập nhật`,
    });
  },

  //deleteTechnology
  deleteTechnology: async (req, res) => {
    const { id } = req.query;
    const result = await TechnologyService.deleteTechnology(id);
    return res.json({
      message: "Xóa công nghệ thành công!",
    });
  },
  getTechnologyList: async (req, res) => {
    const result = await TechnologyService.getTechnologyList(req.body);
    return res.json({
      message: "Lấy danh mục thành công!",
      data: result,
      status: 200,
    });
  },
};

export default technologyController;
