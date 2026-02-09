# QuickCart Backend API Documentation

**Base URL**: `http://localhost:8080/api`

**Content-Type**: `application/json`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products-public)
3. [Categories](#3-categories-public)
4. [Cart](#4-cart-requires-authentication)
5. [Wishlist](#5-wishlist-requires-authentication)
6. [Orders](#6-orders-requires-authentication)
7. [Admin - Products](#7-admin---products-requires-admin-role)
8. [Admin - Orders](#8-admin---orders-requires-admin-role)
9. [Admin - Users](#9-admin---users-requires-admin-role)
10. [Error Responses](#10-error-responses)

---

## Authentication Header

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication

### 1.1 Register User

Creates a new user account with `ROLE_USER`.

**Endpoint**: `POST /api/auth/register`

**Authentication**: Not required

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `firstName` | Required, max 50 characters |
| `lastName` | Required, max 50 characters |
| `email` | Required, valid email format, max 100 characters, must be unique |
| `password` | Required, 6-100 characters |

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3MDM1ODI0MDAsImV4cCI6MTcwMzY2ODgwMH0...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isEnabled": true,
    "createdAt": "2024-12-26T10:30:00",
    "roles": ["ROLE_USER"]
  }
}
```

**Error Response** (400 Bad Request - Email exists):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already registered",
  "path": "/api/auth/register"
}
```

---

### 1.2 Login

Authenticates user and returns JWT token.

**Endpoint**: `POST /api/auth/login`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `email` | Required, valid email format |
| `password` | Required |

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3MDM1ODI0MDAsImV4cCI6MTcwMzY2ODgwMH0...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isEnabled": true,
    "createdAt": "2024-12-26T10:30:00",
    "roles": ["ROLE_USER"]
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "path": "/api/auth/login"
}
```

---

### 1.3 Logout

Invalidates the current JWT token.

**Endpoint**: `POST /api/auth/logout`

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```
"Logout successful"
```

**Error Response** (400 Bad Request):
```
"Invalid token"
```

---

## 2. Products (Public)

### 2.1 Get All Products

Retrieves paginated list of products with optional filtering and sorting.

**Endpoint**: `GET /api/products`

**Authentication**: Not required

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `categoryId` | Integer | null | Filter by category ID |
| `q` | String | null | Search in product name and description |
| `sortBy` | String | null | Sort format: `field,direction` (e.g., `price,asc`, `name,desc`) |
| `inStock` | Boolean | false | If true, only show products with stock > 0 |
| `page` | Integer | 0 | Page number (0-indexed) |
| `size` | Integer | 12 | Items per page |

**Example Requests**:
```
GET /api/products
GET /api/products?categoryId=1&page=0&size=10
GET /api/products?q=laptop&sortBy=price,asc
GET /api/products?inStock=true&sortBy=name,asc
```

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "MacBook Pro 14\"",
      "description": "Apple MacBook Pro with M3 chip",
      "price": 1999.99,
      "stockQuantity": 25,
      "imageUrl": "https://example.com/images/macbook.jpg",
      "category": {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      },
      "createdAt": "2024-12-20T08:00:00"
    },
    {
      "id": 2,
      "name": "iPhone 15 Pro",
      "description": "Latest Apple smartphone",
      "price": 999.99,
      "stockQuantity": 50,
      "imageUrl": "https://example.com/images/iphone.jpg",
      "category": {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      },
      "createdAt": "2024-12-20T08:00:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12,
    "sort": {
      "sorted": false,
      "unsorted": true,
      "empty": true
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 40,
  "totalPages": 4,
  "last": false,
  "first": true,
  "size": 12,
  "number": 0,
  "numberOfElements": 12,
  "empty": false
}
```

---

### 2.2 Get Product by ID

Retrieves a single product by its ID.

**Endpoint**: `GET /api/products/{id}`

**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Product ID |

**Example Request**:
```
GET /api/products/1
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "MacBook Pro 14\"",
  "description": "Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
  "price": 1999.99,
  "stockQuantity": 25,
  "imageUrl": "https://example.com/images/macbook.jpg",
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  "createdAt": "2024-12-20T08:00:00"
}
```

**Error Response** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 999",
  "path": "/api/products/999"
}
```

---

## 3. Categories (Public)

### 3.1 Get All Categories

Retrieves all product categories.

**Endpoint**: `GET /api/categories`

**Authentication**: Not required

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  {
    "id": 2,
    "name": "Clothing",
    "description": "Apparel and fashion items"
  },
  {
    "id": 3,
    "name": "Books",
    "description": "Books, magazines, and publications"
  },
  {
    "id": 4,
    "name": "Home & Kitchen",
    "description": "Home appliances and kitchen essentials"
  }
]
```

---

### 3.2 Get Category by ID

Retrieves a single category by its ID.

**Endpoint**: `GET /api/categories/{id}`

**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | Category ID |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Error Response** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Category not found with id: 999",
  "path": "/api/categories/999"
}
```

---

## 4. Cart (Requires Authentication)

> **Note**: All cart endpoints require `ROLE_USER`. Guest users should manage cart state client-side and merge on login.

### 4.1 Get Cart

Retrieves the current user's shopping cart.

**Endpoint**: `GET /api/cart`

**Authentication**: Required (`ROLE_USER`)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "quantity": 1,
      "subtotal": 1999.99
    },
    {
      "id": 102,
      "productId": 5,
      "productName": "Wireless Mouse",
      "productPrice": 49.99,
      "productImageUrl": "https://example.com/images/mouse.jpg",
      "quantity": 2,
      "subtotal": 99.98
    }
  ],
  "totalAmount": 2099.97
}
```

**Empty Cart Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "totalAmount": 0.00
}
```

---

### 4.2 Add Item to Cart

Adds a product to the cart or updates quantity if already exists.

**Endpoint**: `POST /api/cart/items`

**Authentication**: Required (`ROLE_USER`)

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `productId` | Required |
| `quantity` | Required, minimum 1 |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "quantity": 2,
      "subtotal": 3999.98
    }
  ],
  "totalAmount": 3999.98
}
```

**Error Response - Insufficient Stock** (400 Bad Request):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock for product 'MacBook Pro 14\"'. Requested: 100, Available: 25",
  "path": "/api/cart/items"
}
```

**Error Response - Product Not Found** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 999",
  "path": "/api/cart/items"
}
```

---

### 4.3 Update Cart Item Quantity

Updates the quantity of a specific item in the cart.

**Endpoint**: `PUT /api/cart/items/{productId}`

**Authentication**: Required (`ROLE_USER`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | Long | Product ID to update |

**Request Body**:
```json
{
  "quantity": 3
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `quantity` | Required, minimum 1 |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "quantity": 3,
      "subtotal": 5999.97
    }
  ],
  "totalAmount": 5999.97
}
```

---

### 4.4 Remove Item from Cart

Removes a product from the cart.

**Endpoint**: `DELETE /api/cart/items/{productId}`

**Authentication**: Required (`ROLE_USER`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | Long | Product ID to remove |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "totalAmount": 0.00
}
```

---

### 4.5 Merge Guest Cart

Merges guest cart items with the user's persistent cart after login.

**Endpoint**: `POST /api/cart/merge`

**Authentication**: Required (`ROLE_USER`)

> **Important**: Call this endpoint immediately after login if the guest had items in their local cart.

**Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 5,
      "quantity": 1
    }
  ]
}
```

**Merge Behavior**:
- If product exists in both carts: quantities are summed (up to available stock)
- If product only in guest cart: added to persistent cart
- Stock availability is validated for all items

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "quantity": 3,
      "subtotal": 5999.97
    },
    {
      "id": 102,
      "productId": 5,
      "productName": "Wireless Mouse",
      "productPrice": 49.99,
      "productImageUrl": "https://example.com/images/mouse.jpg",
      "quantity": 1,
      "subtotal": 49.99
    }
  ],
  "totalAmount": 6049.96
}
```

---

### 4.6 Clear Cart

Removes all items from the cart.

**Endpoint**: `DELETE /api/cart`

**Authentication**: Required (`ROLE_USER`)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "totalAmount": 0.00
}
```

---

## 5. Wishlist (Requires Authentication)

> **Note**: All wishlist endpoints require `ROLE_USER`. The wishlist allows users to save products for later without adding them to cart.

### 5.1 Get Wishlist

Retrieves the current user's wishlist.

**Endpoint**: `GET /api/wishlist`

**Authentication**: Required (`ROLE_USER`)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "stockQuantity": 25,
      "addedAt": "2024-12-26T10:30:00"
    },
    {
      "id": 102,
      "productId": 5,
      "productName": "Wireless Mouse",
      "productPrice": 49.99,
      "productImageUrl": "https://example.com/images/mouse.jpg",
      "stockQuantity": 100,
      "addedAt": "2024-12-25T14:00:00"
    }
  ],
  "itemCount": 2
}
```

**Empty Wishlist Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "itemCount": 0
}
```

---

### 5.2 Add Item to Wishlist

Adds a product to the wishlist. If the product already exists in the wishlist, the existing wishlist is returned (no duplicate entries).

**Endpoint**: `POST /api/wishlist/items`

**Authentication**: Required (`ROLE_USER`)

**Request Body**:
```json
{
  "productId": 1
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `productId` | Required |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [
    {
      "id": 101,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "productPrice": 1999.99,
      "productImageUrl": "https://example.com/images/macbook.jpg",
      "stockQuantity": 25,
      "addedAt": "2024-12-26T10:30:00"
    }
  ],
  "itemCount": 1
}
```

**Error Response - Product Not Found** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 999",
  "path": "/api/wishlist/items"
}
```

---

### 5.3 Remove Item from Wishlist

Removes a product from the wishlist.

**Endpoint**: `DELETE /api/wishlist/items/{productId}`

**Authentication**: Required (`ROLE_USER`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | Long | Product ID to remove |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "itemCount": 0
}
```

---

### 5.4 Clear Wishlist

Removes all items from the wishlist.

**Endpoint**: `DELETE /api/wishlist`

**Authentication**: Required (`ROLE_USER`)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "items": [],
  "itemCount": 0
}
```

---

## 6. Orders (Requires Authentication)

> **Note**: All order endpoints require `ROLE_USER`.

### 6.1 Create Order (Checkout)

Creates a new order from the current cart contents.

**Endpoint**: `POST /api/orders`

**Authentication**: Required (`ROLE_USER`)

**Request Body**:
```json
{
  "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001",
  "paymentMethodId": "pm_card_visa"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `shippingAddress` | Required, cannot be blank |
| `paymentMethodId` | Optional (for Stripe integration - not yet implemented) |

**Checkout Process**:
1. Validates cart is not empty
2. Validates stock availability for all items
3. Creates order with `PENDING` status
4. Stores `priceAtPurchase` for each item (historical pricing)
5. Deducts stock quantities from products
6. Clears the user's cart

**Success Response** (201 Created):
```json
{
  "id": 1001,
  "userId": 1,
  "orderDate": "2024-12-26T10:30:00",
  "status": "PENDING",
  "totalAmount": 2099.97,
  "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001",
  "items": [
    {
      "id": 5001,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "quantity": 1,
      "priceAtPurchase": 1999.99,
      "subtotal": 1999.99
    },
    {
      "id": 5002,
      "productId": 5,
      "productName": "Wireless Mouse",
      "quantity": 2,
      "priceAtPurchase": 49.99,
      "subtotal": 99.98
    }
  ]
}
```

**Error Response - Empty Cart** (400 Bad Request):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot create order from empty cart",
  "path": "/api/orders"
}
```

**Error Response - Insufficient Stock** (400 Bad Request):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock for product 'MacBook Pro 14\"'. Requested: 30, Available: 25",
  "path": "/api/orders"
}
```

---

### 6.2 Get User's Orders

Retrieves all orders for the authenticated user, sorted by date (newest first).

**Endpoint**: `GET /api/orders`

**Authentication**: Required (`ROLE_USER`)

**Success Response** (200 OK):
```json
[
  {
    "id": 1002,
    "userId": 1,
    "orderDate": "2024-12-26T10:30:00",
    "status": "PENDING",
    "totalAmount": 1999.99,
    "shippingAddress": "123 Main Street, New York, NY 10001",
    "items": [
      {
        "id": 5003,
        "productId": 1,
        "productName": "MacBook Pro 14\"",
        "quantity": 1,
        "priceAtPurchase": 1999.99,
        "subtotal": 1999.99
      }
    ]
  },
  {
    "id": 1001,
    "userId": 1,
    "orderDate": "2024-12-25T14:00:00",
    "status": "SHIPPED",
    "totalAmount": 149.97,
    "shippingAddress": "456 Oak Avenue, Los Angeles, CA 90001",
    "items": [
      {
        "id": 5001,
        "productId": 10,
        "productName": "Bluetooth Headphones",
        "quantity": 1,
        "priceAtPurchase": 149.97,
        "subtotal": 149.97
      }
    ]
  }
]
```

---

### 6.3 Get Order by ID

Retrieves a specific order (user can only view their own orders).

**Endpoint**: `GET /api/orders/{id}`

**Authentication**: Required (`ROLE_USER`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Order ID |

**Success Response** (200 OK):
```json
{
  "id": 1001,
  "userId": 1,
  "orderDate": "2024-12-26T10:30:00",
  "status": "PENDING",
  "totalAmount": 2099.97,
  "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001",
  "items": [
    {
      "id": 5001,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "quantity": 1,
      "priceAtPurchase": 1999.99,
      "subtotal": 1999.99
    },
    {
      "id": 5002,
      "productId": 5,
      "productName": "Wireless Mouse",
      "quantity": 2,
      "priceAtPurchase": 49.99,
      "subtotal": 99.98
    }
  ]
}
```

**Error Response - Order Not Found** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Order not found with id: 9999",
  "path": "/api/orders/9999"
}
```

**Error Response - Not Owner** (404 Not Found):
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Order not found with id: 1001",
  "path": "/api/orders/1001"
}
```

---

## 7. Admin - Products (Requires ADMIN Role)

> **Note**: All admin endpoints require `ROLE_ADMIN`.

### 7.1 Create Product

Creates a new product.

**Endpoint**: `POST /api/admin/products`

**Authentication**: Required (`ROLE_ADMIN`)

**Request Body**:
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship smartphone with AI features",
  "price": 899.99,
  "stockQuantity": 100,
  "imageUrl": "https://example.com/images/galaxy-s24.jpg",
  "categoryId": 1
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `name` | Required, max 100 characters |
| `description` | Optional |
| `price` | Required, greater than 0, max 8 integer + 2 decimal digits |
| `stockQuantity` | Required, minimum 0 |
| `imageUrl` | Optional, max 255 characters |
| `categoryId` | Required |

**Success Response** (201 Created):
```json
{
  "id": 41,
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship smartphone with AI features",
  "price": 899.99,
  "stockQuantity": 100,
  "imageUrl": "https://example.com/images/galaxy-s24.jpg",
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  "createdAt": "2024-12-26T10:30:00"
}
```

---

### 7.2 Update Product

Updates an existing product (partial update supported).

**Endpoint**: `PUT /api/admin/products/{id}`

**Authentication**: Required (`ROLE_ADMIN`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Product ID |

**Request Body** (all fields optional):
```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "price": 1199.99,
  "stockQuantity": 75
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `name` | Optional, max 100 characters |
| `description` | Optional |
| `price` | Optional, greater than 0 if provided |
| `stockQuantity` | Optional, minimum 0 if provided |
| `imageUrl` | Optional, max 255 characters |
| `categoryId` | Optional |

**Success Response** (200 OK):
```json
{
  "id": 41,
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Latest Samsung flagship smartphone with AI features",
  "price": 1199.99,
  "stockQuantity": 75,
  "imageUrl": "https://example.com/images/galaxy-s24.jpg",
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  "createdAt": "2024-12-26T10:30:00"
}
```

---

### 7.3 Delete Product

Deletes a product.

**Endpoint**: `DELETE /api/admin/products/{id}`

**Authentication**: Required (`ROLE_ADMIN`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Product ID |

**Success Response** (204 No Content):
```
(empty body)
```

---

## 8. Admin - Orders (Requires ADMIN Role)

### 8.1 Get All Orders

Retrieves all orders in the system, sorted by date (newest first).

**Endpoint**: `GET /api/admin/orders`

**Authentication**: Required (`ROLE_ADMIN`)

**Success Response** (200 OK):
```json
[
  {
    "id": 1002,
    "userId": 2,
    "orderDate": "2024-12-26T11:00:00",
    "status": "PENDING",
    "totalAmount": 549.99,
    "shippingAddress": "789 Pine Road, Chicago, IL 60601",
    "items": [
      {
        "id": 5005,
        "productId": 15,
        "productName": "Smart Watch",
        "quantity": 1,
        "priceAtPurchase": 549.99,
        "subtotal": 549.99
      }
    ]
  },
  {
    "id": 1001,
    "userId": 1,
    "orderDate": "2024-12-26T10:30:00",
    "status": "SHIPPED",
    "totalAmount": 2099.97,
    "shippingAddress": "123 Main Street, New York, NY 10001",
    "items": [
      {
        "id": 5001,
        "productId": 1,
        "productName": "MacBook Pro 14\"",
        "quantity": 1,
        "priceAtPurchase": 1999.99,
        "subtotal": 1999.99
      },
      {
        "id": 5002,
        "productId": 5,
        "productName": "Wireless Mouse",
        "quantity": 2,
        "priceAtPurchase": 49.99,
        "subtotal": 99.98
      }
    ]
  }
]
```

---

### 8.2 Update Order Status

Updates the status of an order.

**Endpoint**: `PUT /api/admin/orders/{id}/status`

**Authentication**: Required (`ROLE_ADMIN`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Order ID |

**Request Body**:
```json
{
  "status": "SHIPPED"
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `status` | Required, must be one of: `PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |

**Order Status Flow**:
```
PENDING → SHIPPED → DELIVERED
    ↓         ↓          ↓
    └─────────┴──────────┴──→ CANCELLED
```

**Success Response** (200 OK):
```json
{
  "id": 1001,
  "userId": 1,
  "orderDate": "2024-12-26T10:30:00",
  "status": "SHIPPED",
  "totalAmount": 2099.97,
  "shippingAddress": "123 Main Street, New York, NY 10001",
  "items": [
    {
      "id": 5001,
      "productId": 1,
      "productName": "MacBook Pro 14\"",
      "quantity": 1,
      "priceAtPurchase": 1999.99,
      "subtotal": 1999.99
    }
  ]
}
```

---

## 9. Admin - Users (Requires ADMIN Role)

### 9.1 Get All Users

Retrieves all users in the system.

**Endpoint**: `GET /api/admin/users`

**Authentication**: Required (`ROLE_ADMIN`)

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@quickcart.com",
    "isEnabled": true,
    "createdAt": "2024-12-01T00:00:00",
    "roles": ["ROLE_ADMIN", "ROLE_USER"]
  },
  {
    "id": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isEnabled": true,
    "createdAt": "2024-12-20T10:00:00",
    "roles": ["ROLE_USER"]
  },
  {
    "id": 3,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "isEnabled": false,
    "createdAt": "2024-12-21T14:30:00",
    "roles": ["ROLE_USER"]
  }
]
```

---

### 9.2 Get User by ID

Retrieves a specific user by ID.

**Endpoint**: `GET /api/admin/users/{id}`

**Authentication**: Required (`ROLE_ADMIN`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | User ID |

**Success Response** (200 OK):
```json
{
  "id": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "isEnabled": true,
  "createdAt": "2024-12-20T10:00:00",
  "roles": ["ROLE_USER"]
}
```

---

### 9.3 Update User Status

Enables or disables a user account.

**Endpoint**: `PUT /api/admin/users/{id}/status`

**Authentication**: Required (`ROLE_ADMIN`)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | User ID |

**Request Body**:
```json
{
  "isEnabled": false
}
```

**Validation Rules**:
| Field | Rules |
|-------|-------|
| `isEnabled` | Required, boolean |

**Success Response** (200 OK):
```json
{
  "id": 3,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "isEnabled": false,
  "createdAt": "2024-12-21T14:30:00",
  "roles": ["ROLE_USER"]
}
```

---

### 9.4 Register Admin User

Creates a new user with `ROLE_ADMIN`.

**Endpoint**: `POST /api/admin/users/register-admin`

**Authentication**: Required (`ROLE_ADMIN`)

**Request Body**:
```json
{
  "firstName": "New",
  "lastName": "Admin",
  "email": "new.admin@quickcart.com",
  "password": "securePassword123"
}
```

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 11,
    "firstName": "New",
    "lastName": "Admin",
    "email": "new.admin@quickcart.com",
    "isEnabled": true,
    "createdAt": "2024-12-26T10:30:00",
    "roles": ["ROLE_ADMIN"]
  }
}
```

---

## 10. Error Responses

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Description of what went wrong",
  "path": "/api/endpoint",
  "validationErrors": null
}
```

### Validation Error Response

When request body validation fails:

```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/register",
  "validationErrors": {
    "email": "Email must be valid",
    "password": "Password must be between 6 and 100 characters",
    "firstName": "First name is required"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 204 | No Content | Delete succeeded |
| 400 | Bad Request | Validation error, empty cart, insufficient stock |
| 401 | Unauthorized | Missing/invalid token, wrong credentials |
| 403 | Forbidden | Insufficient permissions (wrong role) |
| 404 | Not Found | Resource doesn't exist or access denied |
| 500 | Internal Server Error | Unexpected server error |

### Common Error Scenarios

**401 Unauthorized - Missing Token**:
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/cart"
}
```

**403 Forbidden - Insufficient Role**:
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/admin/products"
}
```

---

## Frontend Implementation Notes

### Token Storage

Store the JWT token securely after login/register:
```javascript
localStorage.setItem('token', response.token);
// or sessionStorage for session-only persistence
```

### API Request Helper

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
```

### Guest Cart Flow

1. Store guest cart in `localStorage`:
```javascript
const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
```

2. On login success, merge with server:
```javascript
if (guestCart.length > 0) {
    await apiRequest('/cart/merge', {
        method: 'POST',
        body: JSON.stringify({ items: guestCart }),
    });
    localStorage.removeItem('guestCart');
}
```

### Role-Based UI

Check user roles from the auth response:
```javascript
const isAdmin = user.roles.includes('ROLE_ADMIN');
const isUser = user.roles.includes('ROLE_USER');
```

---

## Data Types Reference

| Type | Format | Example |
|------|--------|---------|
| Long | Integer | `1`, `1001` |
| Integer | Integer | `1`, `100` |
| BigDecimal | Decimal (2 places) | `99.99`, `1999.00` |
| LocalDateTime | ISO 8601 | `"2024-12-26T10:30:00"` |
| Boolean | true/false | `true`, `false` |
| String | Text | `"example text"` |

---

## Test Credentials

For development/testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quickcart.com | admin123 |
| User | user1@test.com | password123 |
| User | user2@test.com | password123 |

> **Warning**: Change these credentials in production!