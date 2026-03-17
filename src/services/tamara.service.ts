import jwt from "jsonwebtoken";
import config from "../config/config";
import { AppError } from "../utils/AppError";
import { OrderDocument } from "../models/order.model";

interface TamaraCheckoutResult {
    checkoutUrl: string;
    paymentId: string;
}

export class TamaraService {
    /**
     * Formats phone number for Tamara (expects SA format without +966, e.g., 501234567)
     */
    private formatPhoneNumber(phone: string): string {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, "");
        // Remove country code for SA (966) if present
        if (cleaned.startsWith("966")) {
            cleaned = cleaned.substring(3);
        }
        // Remove leading zero if present (e.g., 050 -> 50)
        if (cleaned.startsWith("0")) {
            cleaned = cleaned.substring(1);
        }
        return cleaned;
    }

    /**
     * Creates a Tamara checkout session for the given order.
     * Returns the hosted checkout URL and the Tamara order ID.
     */
    async createCheckoutSession(
        order: OrderDocument
    ): Promise<TamaraCheckoutResult> {
        const nameParts = order.contact.fullName.split(" ");
        const firstName = nameParts[0] || "Guest";
        const lastName = nameParts.slice(1).join(" ") || "User";
        const phone = this.formatPhoneNumber(order.contact.phone);

        console.log(`[Tamara] Creating checkout for Order #${order._id}...`);
        console.log(`[Tamara] API URL: ${config.tamaraApiUrl}`);
        if (config.tamaraApiToken) {
            const tokenPreview = `${config.tamaraApiToken.substring(0, 4)}...${config.tamaraApiToken.substring(config.tamaraApiToken.length - 4)}`;
            console.log(`[Tamara] Using Token: ${tokenPreview}`);
        } else {
            console.warn(`[Tamara] API Token is MISSING!`);
        }

        const address = {
            first_name: firstName,
            last_name: lastName,
            line1: order.shipping.address,
            city: order.shipping.city,
            postal_code: order.shipping.zipCode,
            country_code: "SA",
            phone_number: phone,
        };

        const payload = {
            order_reference_id: String(order._id),
            order_number: String(order._id),
            total_amount: {
                amount: order.total,
                currency: "SAR",
            },
            description: `Order #${order._id}`,
            country_code: "SA",
            payment_type: "PAY_BY_INSTALMENTS",
            instalments: 3,
            locale: "en_US",
            items: order.items.map((item) => ({
                reference_id: item.productId,
                type: "Physical",
                name: item.name,
                sku: item.productId,
                quantity: item.quantity,
                unit_price: {
                    amount: item.price,
                    currency: "SAR",
                },
                total_amount: {
                    amount: item.price * item.quantity,
                    currency: "SAR",
                },
                tax_amount: {
                    amount: 0,
                    currency: "SAR",
                },
                discount_amount: {
                    amount: 0,
                    currency: "SAR",
                },
            })),
            consumer: {
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                email: order.contact.email,
            },
            billing_address: address,
            shipping_address: address,
            tax_amount: {
                amount: order.tax,
                currency: "SAR",
            },
            shipping_amount: {
                amount: order.shippingCost,
                currency: "SAR",
            },
            merchant_url: {
                success: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/success`,
                cancel: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/cancel`,
                failure: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/order/${order._id}/failure`,
                notification: `${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/order/webhook/tamara`,
            },
            platform: "Zendo Backend",
            is_mobile: false,
        };

        const response = await fetch(`${config.tamaraApiUrl}/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.tamaraApiToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Tamara] Error response: ${errorBody}`);
            throw new AppError({
                statusCode: 502,
                code: "TAMARA_CHECKOUT_FAILED",
                message: "Failed to create Tamara checkout session.",
                metadata: {
                    tamaraError: errorBody,
                    apiUrl: config.tamaraApiUrl,
                    // Token is intentionally NOT included in metadata for security
                },
            });
        }

        const data = (await response.json()) as any;

        const checkoutUrl = data?.checkout_url;
        const paymentId = data?.order_id;

        if (!checkoutUrl || !paymentId) {
            throw new AppError({
                statusCode: 502,
                code: "TAMARA_INVALID_RESPONSE",
                message:
                    "Tamara checkout response did not contain a valid URL or order ID.",
                metadata: { tamaraResponse: data },
            });
        }

        return { checkoutUrl, paymentId };
    }

    /**
     * Fetches the live status of a Tamara payment by its ID.
     */
    async getPaymentStatus(paymentId: string): Promise<{ status: string }> {
        const response = await fetch(`${config.tamaraApiUrl}/orders/${paymentId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${config.tamaraApiToken}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new AppError({
                statusCode: 502,
                code: "TAMARA_FETCH_FAILED",
                message: "Failed to fetch Tamara payment status.",
                metadata: { tamaraError: errorBody },
            });
        }

        const data = (await response.json()) as any;
        return { status: data?.status ?? "unknown" };
    }

    /**
     * Verifies the Tamara notification token (JWT).
     * @param token The tamaraToken from the webhook request.
     */
    verifyWebhookSignature(token: string): boolean {
        if (!config.tamaraNotificationToken || !token) return false;

        try {
            jwt.verify(token, config.tamaraNotificationToken, {
                algorithms: ["HS256"],
            });
            return true;
        } catch (err) {
            return false;
        }
    }
}

export const tamaraService = new TamaraService();
