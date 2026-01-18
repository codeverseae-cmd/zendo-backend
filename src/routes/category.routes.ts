import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import { createCategorySchema } from "../validation/category.validation";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";
import { mongoIdSchema } from "../validation/Id.validation";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router
  .route("/")
  .post(
    adminAuth,
    validateRequest(createCategorySchema),
    asyncHandler(createCategory)
  )
  .get(asyncHandler(getCategories));

router
  .route("/:id")
  .get(validateRequest(mongoIdSchema), asyncHandler(getCategoryById))
  .patch(
    adminAuth,
    validateRequest(mongoIdSchema),
    asyncHandler(updateCategory)
  )
  .delete(
    adminAuth,
    validateRequest(mongoIdSchema),
    asyncHandler(deleteCategory)
  );

export { router as apiCategoryRouter };
