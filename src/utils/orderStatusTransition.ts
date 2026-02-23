import { AppError } from "./AppError";

export type OrderStatus =
    | "pending_payment"
    | "placed"
    | "processing"
    | "shipped"
    | "delivered";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

/**
 * Valid manual transitions (admin-driven).
 * pending_payment → only webhook can advance (not admin).
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending_payment: [],
    placed: ["processing"],
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
};

/**
 * Asserts that transitioning an order from `current` to `next` is valid.
 * Also enforces that paymentStatus must be "paid" to advance beyond placed.
 *
 * @throws AppError(400) if the transition is not allowed.
 */
export function assertValidTransition(
    current: OrderStatus,
    next: OrderStatus,
    paymentStatus: PaymentStatus
): void {
    const allowed = VALID_TRANSITIONS[current];

    if (!allowed.includes(next)) {
        throw new AppError({
            statusCode: 400,
            code: "INVALID_STATUS_TRANSITION",
            message: `Cannot transition order from "${current}" to "${next}". ${allowed.length > 0
                ? `Allowed next status: ${allowed.map((s) => `"${s}"`).join(", ")}.`
                : `No further transitions are allowed from "${current}".`
                }`,
        });
    }

    // Enforce payment guard: cannot advance fulfillment without payment
    if (next !== "placed" && paymentStatus !== "paid") {
        throw new AppError({
            statusCode: 400,
            code: "PAYMENT_REQUIRED",
            message: `Cannot move order to "${next}" because payment has not been confirmed (paymentStatus: "${paymentStatus}").`,
        });
    }
}
