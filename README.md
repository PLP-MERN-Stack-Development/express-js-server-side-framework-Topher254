#  Product API - Complete Documentation - SAROTA RAPHAEL

##  Overview
A RESTful API for managing products built with Express.js. This API provides full CRUD operations, authentication, validation, and advanced features like filtering, pagination, and search.

**Base URL**: `http://localhost:3000`

##  Authentication
All endpoints (except the root) require authentication via API key in the request header.

**Header**: `x-api-key: my-secret-api-key-123`

##  Endpoints

### 1. Root Endpoint
**GET** `/`
- **Description**: Welcome message and API information
- **Authentication**: None
- **Response**: 
```json
{
  "message": "Welcome to the Product API!",
  "endpoints": {
    "products": "/api/products",
    "documentation": "See README.md for API documentation"
  }
}
```

### 2. Get All Products
**GET** `/api/products`
- **Description**: Retrieve all products with optional filtering, pagination, and search
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., `electronics`)
  - `inStock` (optional): Filter by stock status (e.g., `true` or `false`)
  - `q` (optional): Search in name and description
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Products per page (default: 10)
- **Response**:
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 3,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 3. Search Products
**GET** `/api/products/search`
- **Description**: Search products by name or description
- **Query Parameters**:
  - `q` (required): Search term
- **Response**:
```json
{
  "query": "laptop",
  "results": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 4. Get Product Statistics
**GET** `/api/products/stats`
- **Description**: Get comprehensive product statistics
- **Response**:
```json
{
  "totalProducts": 3,
  "totalInStock": 2,
  "totalOutOfStock": 1,
  "categories": {
    "electronics": 2,
    "kitchen": 1
  },
  "priceStats": {
    "highest": 1200,
    "lowest": 50,
    "average": 683.33
  }
}
```

### 5. Get Single Product
**GET** `/api/products/:id`
- **Description**: Get a specific product by ID
- **Path Parameters**:
  - `id` (required): Product ID
- **Response**:
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Create Product
**POST** `/api/products`
- **Description**: Create a new product
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Wireless Headphones",
  "description": "Noise cancelling wireless headphones",
  "price": 199.99,
  "category": "electronics",
  "inStock": true
}
```
- **Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wireless Headphones",
  "description": "Noise cancelling wireless headphones",
  "price": 199.99,
  "category": "electronics",
  "inStock": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 7. Update Product
**PUT** `/api/products/:id`
- **Description**: Update an existing product
- **Path Parameters**:
  - `id` (required): Product ID
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4080",
  "price": 1800,
  "category": "electronics",
  "inStock": false
}
```
- **Response**:
```json
{
  "id": "1",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4080",
  "price": 1800,
  "category": "electronics",
  "inStock": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

### 8. Delete Product
**DELETE** `/api/products/:id`
- **Description**: Delete a product
- **Path Parameters**:
  - `id` (required): Product ID
- **Response**:
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": "3",
    "name": "Coffee Maker",
    "description": "Programmable coffee maker with timer",
    "price": 50,
    "category": "kitchen",
    "inStock": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

##  Error Responses

### 400 - Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    "Name is required and must be a string",
    "Price is required and must be a positive number"
  ]
}
```

### 401 - Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "API key is required in x-api-key header"
}
```

### 403 - Forbidden
```json
{
  "error": "Forbidden",
  "message": "Invalid API key"
}
```

### 404 - Not Found
```json
{
  "error": "NotFoundError",
  "message": "Product with id 999 not found"
}
```

### 404 - Route Not Found
```json
{
  "error": "NotFound",
  "message": "Route GET /api/invalid-route not found"
}
```

### 500 - Internal Server Error
```json
{
  "error": "InternalServerError",
  "message": "Internal Server Error"
}
```

##  Example Requests

### Get All Electronics
```bash
curl -H "x-api-key: my-secret-api-key-123" \
  "http://localhost:3000/api/products?category=electronics"
```

### Search for Products
```bash
curl -H "x-api-key: my-secret-api-key-123" \
  "http://localhost:3000/api/products/search?q=phone"
```

### Create a Product
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key-123" \
  -d '{
    "name": "Tablet",
    "description": "10-inch tablet with stylus",
    "price": 399.99,
    "category": "electronics",
    "inStock": true
  }' \
  http://localhost:3000/api/products
```

### Update a Product
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key-123" \
  -d '{
    "name": "Updated Laptop",
    "description": "Updated description",
    "price": 1300,
    "category": "electronics",
    "inStock": true
  }' \
  http://localhost:3000/api/products/1
```

### Delete a Product
```bash
curl -X DELETE \
  -H "x-api-key: my-secret-api-key-123" \
  http://localhost:3000/api/products/2
```

##  Product Schema
```javascript
{
  id: "string" (UUID, auto-generated),
  name: "string" (required),
  description: "string" (required),
  price: "number" (required, positive),
  category: "string" (required),
  inStock: "boolean" (default: true),
  createdAt: "string" (ISO date, auto-generated),
  updatedAt: "string" (ISO date, auto-generated on update)
}
```

## 🔧 Setup Instructions

### 1. Installation
```bash
npm install express body-parser uuid
```

### 2. Environment Variables
Create a `.env` file:
```env
PORT=3000
API_KEY=my-secret-api-key-123
```

### 3. Start Server
```bash
npm start
```

### 4. Development Mode
```bash
npm run dev
```

##  Project Structure
```
project/
├── config/
│   └── env.js
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   ├── validation.js
│   └── errorHandler.js
├── routes/
│   └── products.js
├── utils/
│   └── errors.js
├── server.js
└── package.json
```

## Features Implemented
-  Authentication with API key
-  Request logging
-  RESTful API design
-  Input validation
-  Comprehensive error handling
-  Filtering by category and stock status
-  Pagination
-  Search functionality
-  Product statistics
-  In-memory data storage
-  Proper HTTP status codes

