import express from "express";
import technologyMiddlewares from "../../middlewares/technologyMiddlewares.js";
import technologyController from "../../controllers/technologyController.js";
import wrapAsync from "../../utils/handlers.js";
const router = express.Router();

// add technology
router.post(
  "/",
  technologyMiddlewares.addTechnologyValidator,
  wrapAsync(technologyController.addTechnology)
);

//update technology
router.put(
  "/",
  technologyMiddlewares.updateTechnologyValidator,
  wrapAsync(technologyController.updateTechnology)
);
//delete technology
router.delete(
  "/",
  technologyMiddlewares.deleteTechnologyValidator,
  wrapAsync(technologyController.deleteTechnology)
);

// // get technology get-list

router.post("/get-list", wrapAsync(technologyController.getTechnologyList));

export default router;
