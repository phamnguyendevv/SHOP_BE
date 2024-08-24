import ProductServices from "../services/productServices.js";

let productsController = {
  // add product
  addProductController: async (req, res) => {
    const result = await ProductServices.addProduct(req.body);
    return res.json({
      message: "Thêm sản phẩm thành công!",
      status: 200,
    });
  },
  //update product
  updateProductController: async (req, res) => {
    const result = await ProductServices.updateProduct(req.body);
    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      status: 200,
    });
  },

  deleteProductController: async (req, res) => {
    const { id } = req.query;

    const result = await ProductServices.deleteProduct(id);
    return res.json({
      message: "Xóa sản phẩm thành công!",
      status: 200,
    });
  },
  getProductBySlug: async (req, res) => {
    const { slug_product } = req.query;

    const result = await ProductServices.getProductBySlug(slug_product);
    return res.json({
      message: "Lấy sản phẩm thành công!",
      data: result,
    });
  },

  getList: async (req, res) => {
    const result = await ProductServices.getList(req.body);
    return res.json({
      message: "Lấy danh sách sản phẩm thành công!",
      data: result,
      status: 200,
    });
  },

  addImageController: async (req, res) => {
    const result = await ProductServices.addImage(req.body);
    return res.json({
      message: "Thêm ảnh sản phẩm thành công!",
      data: result,
      status: 200,
    });
  },
  updateImageController: async (req, res) => {
    const result = await ProductServices.updateImage(req.body);
    return res.json({
      message: "Cập nhật ảnh sản phẩm thành công!",
      data: result,
      status: 200,
    });
  },
  deleteImageController: async (req, res) => {
    const { id } = req.query;
    const result = await ProductServices.deleteImage(id);
    return res.json({
      message: "Xóa ảnh sản phẩm thành công!",
      status: 200,
    });
  },
    getImageController: async (req, res) => {
        const { id } = req.query;

        const result = await ProductServices.getImage(id);
        return res.json({
            message: "Lấy ảnh sản phẩm thành công!",
            data: result,
            status: 200,
        });
    }

};

export default productsController;
