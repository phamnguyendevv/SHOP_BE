import express from "express";

import wrapAsync from "../../utils/handlers.js";
const router = express.Router();



// add technology
router.post(
  "/",
  categoryMiddlewares.addCategoryValidator,
  wrapAsync(categoryController.addCategory)
);

//get all technology
router.get("/", wrapAsync(categoryController.getAllCategories));

//update technology
router.put(
  "/",
  categoryMiddlewares.updateCategoryValidator,
  wrapAsync(categoryController.updateCategory)
);

//delete technology
router.delete(
  "/",
  categoryMiddlewares.deleteCategoryValidator,
  wrapAsync(categoryController.deleteCategory)
);

// get technology get-list
router.post("/get-list", wrapAsync(categoryController.getCategoryList));

export default router;
