import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderSchema } from "../validation/order.validation";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { mongoIdSchema } from "../validation/Id.validation";

const router = Router();

router
  .route("/")
  .post(validateRequest(createOrderSchema), asyncHandler(createOrder))
  .get(asyncHandler(getOrders));

router.get("/:id", validateRequest(mongoIdSchema), asyncHandler(getOrderById));
router.patch(
  "/:id/status",
  validateRequest(mongoIdSchema),
  asyncHandler(updateOrderStatus)
);

export { router as apiOrderRouter };
