# Tamara Admin Integration Documentation

This document describes the Tamara integration features available for administrators.

## 1. Webhooks (Automatic Updates)

The backend is configured to receive real-time notifications from Tamara. When a customer completes a payment, Tamara sends a "webhook" to:
`POST /api/order/webhook/tamara`

**Automated Actions:**
- **Order Approved/Authorised:** Sets `paymentStatus` to `"paid"` and `orderStatus` to `"placed"`.
- **Order Declined/Expired:** Sets `paymentStatus` to `"failed"`.
- **Order Canceled:** Sets `paymentStatus` to `"cancelled"`.

## 2. Payment Links for Existing Orders

Admins can generate a 24-hour payment link for orders that are pending payment. This is useful for manual orders or resending a link to a customer.

**Endpoint:** `POST /api/order/:id/payment-link`

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.tamara.co/...",
    "expiresAt": "2024-03-07T15:00:00.000Z",
    "fresh": true
  }
}
```
*Note: If a valid link already exists, the API will return the existing link instead of creating a new session.*

## 3. Order Status Synchronization

If an admin needs to manually verify the status of a Tamara payment, they can trigger a sync.

**Endpoint:** `GET /api/order/:id/sync-payment`

This API calls Tamara's "Get Order Details" endpoint directly and updates the local Zendo database with the latest status.

## 4. Environment Configuration

Ensure the following variables are set in the production environment:

- `TAMARA_API_URL`: `https://api.tamara.co`
- `TAMARA_API_TOKEN`: Your production API token.
- `TAMARA_NOTIFICATION_TOKEN`: Your production notification token (for webhook security).

## 5. Security Note

All incoming webhooks are validated using JWT (JSON Web Token) verification against the `TAMARA_NOTIFICATION_TOKEN`. This ensures that only authentic messages from Tamara are processed.
