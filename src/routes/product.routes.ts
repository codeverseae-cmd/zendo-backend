import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.validation";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProduct,
  deleteProduct,
  editProductById,
  getProductById,
  getProducts,
} from "../controllers/product.controller";
import { mongoIdSchema } from "../validation/Id.validation";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router
  .route("/")
  .get(asyncHandler(getProducts))
  .post(
    adminAuth,
    validateRequest(createProductSchema),
    asyncHandler(createProduct)
  );

router
  .route("/:id")
  .get(validateRequest(mongoIdSchema), asyncHandler(getProductById))
  .patch(
    adminAuth,
    validateRequest(updateProductSchema),
    asyncHandler(editProductById)
  )
  .delete(
    adminAuth,
    validateRequest(mongoIdSchema),
    asyncHandler(deleteProduct)
  );

export { router as apiProductRouter };
