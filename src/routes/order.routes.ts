import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validation/order.validation";
import {
  createOrder,
  getOrderById,
  getOrders,
  handlePaymentLink,
  handleTabbyWebhook,
  handleTamaraWebhook,
  retryPayment,
  syncPaymentStatus,
  updateOrderStatus,
} from "../controllers/order.controller";
import { mongoIdSchema } from "../validation/Id.validation";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// ─── /webhook/tabby ──────────────────────────────────────────────────────────
// Must be registered BEFORE /:id — otherwise Express treats "webhook" as an id.
// Raw body buffering is set up in app.ts for this path.
router.post("/webhook/tabby", asyncHandler(handleTabbyWebhook));
router.post("/webhook/tamara", asyncHandler(handleTamaraWebhook));

// ─── / ───────────────────────────────────────────────────────────────────────
router
  .route("/")
  // Public: create order + receive Tabby checkout URL
  .post(validateRequest(createOrderSchema), asyncHandler(createOrder))
  // Admin: list all orders (paginated)
  .get(adminAuth, asyncHandler(getOrders));

// ─── /:id ────────────────────────────────────────────────────────────────────
router
  .route("/:id")
  // Public: get a single order by ID (used on order confirmation / status page)
  .get(validateRequest(mongoIdSchema), asyncHandler(getOrderById));

// ─── /:id/sync-payment ───────────────────────────────────────────────────────
// Public: frontend calls this on success/cancel/failure redirect pages.
// Fetches live payment state from Tabby and syncs the order accordingly.
router.get(
  "/:id/sync-payment",
  validateRequest(mongoIdSchema),
  asyncHandler(syncPaymentStatus)
);

// ─── /:id/retry-payment ──────────────────────────────────────────────────────
router.post(
  "/:id/retry-payment",
  validateRequest(mongoIdSchema),
  asyncHandler(retryPayment)
);

// ─── /:id/status ─────────────────────────────────────────────────────────────
// Admin: advance fulfillment status (placed → processing → shipped → delivered)
router.patch(
  "/:id/status",
  adminAuth,
  validateRequest(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);

// ─── /:id/payment-link ───────────────────────────────────────────────────────
// Admin: get-or-create a 24h payment link.
// Returns existing link if still active, generates a fresh Tabby session
// if expired or not yet created. Blocked if order is already paid.
router.post(
  "/:id/payment-link",
  adminAuth,
  validateRequest(mongoIdSchema),
  asyncHandler(handlePaymentLink)
);

export { router as apiOrderRouter };
