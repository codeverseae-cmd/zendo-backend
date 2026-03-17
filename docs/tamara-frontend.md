# Tamara Frontend Integration Documentation

This document outlines how to integrate Tamara payment in the Zendo frontend application.

## 1. Creating an Order with Tamara

To initiate a Tamara payment, send a POST request to the create order endpoint with the `paymentMethod` set to `"tamara"`.

**Endpoint:** `POST /api/order`

**Payload Example:**
```json
{
  "contact": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "500000000"
  },
  "shipping": {
    "address": "123 Street",
    "city": "Riyadh",
    "state": "Riyadh",
    "zipCode": "12345",
    "country": "SA"
  },
  "items": [
    {
      "productId": "prod_123",
      "name": "Cool T-Shirt",
      "price": 100,
      "quantity": 1
    }
  ],
  "subtotal": 100,
  "shippingCost": 0,
  "tax": 0,
  "total": 100,
  "paymentMethod": "tamara"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": { ... },
    "checkoutUrl": "https://checkout.tamara.co/checkout/..."
  }
}
```

## 2. Redirecting the User

Upon receiving the `checkoutUrl`, redirect the user to this URL to complete the payment on Tamara's hosted page.

```javascript
window.location.href = response.data.checkoutUrl;
```

## 3. Handling Redirects (Callback URLs)

Tamara will redirect the user back to your frontend based on the payment result:

- **Success:** `${FRONTEND_URL}/order/${orderId}/success`
- **Cancel:** `${FRONTEND_URL}/order/${orderId}/cancel`
- **Failure:** `${FRONTEND_URL}/order/${orderId}/failure`

### Important: Syncing Payment Status
On these landing pages, you **must** call the sync endpoint to ensure the backend has the latest status from Tamara (as webhooks might be slightly delayed).

**Endpoint:** `GET /api/order/:id/sync-payment`

**Frontend Logic Example:**
```javascript
// On the Success/Cancel/Failure page
const syncStatus = async (orderId) => {
  try {
    const res = await fetch(`/api/order/${orderId}/sync-payment`);
    const data = await res.json();
    console.log("Updated order status:", data.data.paymentStatus);
  } catch (error) {
    console.error("Failed to sync status", error);
  }
};
```

## 4. Retrying Payment

If a payment fails or is cancelled, you can allow the user to retry without creating a new order.

**Endpoint:** `POST /api/order/:id/retry-payment`
**Response:** Returns a new `checkoutUrl`.
