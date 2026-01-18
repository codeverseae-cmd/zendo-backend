import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../validation/brand.validation";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router
  .route("/")
  .post(
    adminAuth,
    validateRequest(createBrandSchema),
    asyncHandler(createBrand)
  )
  .get(asyncHandler(getBrands));

router
  .route("/:id")
  .get(asyncHandler(getBrandById))
  .patch(
    adminAuth,
    validateRequest(updateBrandSchema),
    asyncHandler(updateBrand)
  )
  .delete(adminAuth, asyncHandler(deleteBrand));

export { router as brandRouter };
