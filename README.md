# Omorix API

## Overview

Welcome to the Omorix API, a comprehensive backend solution for the Omorix e-commerce platform. This API provides endpoints for user authentication, product management, order processing, category management, cart functionality, customer administration, address management, and order history viewing. Designed to support an online clothing store, it offers both admin and customer interfaces.

### Recent Updates:

- Added `GET /orders` endpoint for customers to view their order history with pagination, filtering, and sorting.
- Introduced address management endpoints for customers.
- Enhanced category model and endpoints to support image uploads.
- Refactored order-related endpoints for improved maintainability.

## Features

- User authentication (register, login, OTP verification)
- Category management (CRUD, hierarchical structure, image uploads)
- Product management (CRUD, stock updates, archiving)
- Order management (place, view, cancel, status updates, history viewing)
- Shopping cart functionality (add, update, remove, checkout)
- Address management (CRUD, set default address)
- Customer management (view, ban, delete by admin)
- API documentation via OpenAPI (Swagger)
- Error handling and logging

## Installation

### Prerequisites

- Node.js (v16.x or later)
- npm (v8.x or later)
- PostgreSQL (for production) or MySQL (via MAMP for local development)
- Git

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/oderahub/Omorix-api.git
   cd Omorix-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file based on `.env.example`.
   - Example for MySQL (local development):
     ```
     PORT=3000
     SWAGGER_PORT=3001
     DATABASE_URL=mysql://root:root@localhost:8889/Omorix_db
     JWT_SECRET=your-secure-jwt-secret
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-email-password
     ```
   - Example for PostgreSQL (production):
     ```
     DATABASE_URL=postgres://user:password@localhost:5432/Omorix_db
     ```

4. **Set up the database:**

   ```bash
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

## Usage

- API base URL: `http://localhost:3000/api`
- Interactive API docs: `http://localhost:3000/api-docs`
- Authenticate users to get a token and use protected endpoints.

### Example Workflow

**Register a user:**

```http
POST /api/auth/register
```

```json
{
  "email": "customer@omorix.com",
  "password": "customer123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**

```http
POST /api/auth/login
```

```json
{
  "email": "customer@omorix.com",
  "password": "customer123"
}
```

**View order history:**

```http
GET /api/orders?limit=10&offset=0&status=pending
```

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "total": 1,
    "orders": [
      {
        "id": "<order_id>",
        "status": "pending",
        "totalAmount": 50.0,
        "createdAt": "2025-03-26T10:00:00Z"
      }
    ]
  }
}
```

## Development

### Model Updates

- **Order Model:** Added fields like `trackingNumber`, `trackingUrl`, `shippedAt`, `deliveredAt`, `cancelledAt`, and `cancelReason`.
- **Category Model:** Supports image uploads, refactored using a reusable `uploadImage` utility.
- **Address Model:** Introduced for address management.

### Utility for Image Uploads

```javascript
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const isValid =
      filetypes.test(path.extname(file.originalname).toLowerCase()) && filetypes.test(file.mimetype)
    return isValid ? cb(null, true) : cb(new Error('Only JPEG/JPG/PNG images are allowed'))
  }
}).single('image')

export default (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    req.imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    next()
  })
}
```

## Testing

Test the API using Postman or a similar tool. Key endpoints:

### Authentication

- `POST /api/auth/register` – Register a user.
- `POST /api/auth/login` – Login to get a token.

### Addresses

- `POST /api/addresses` – Create a new address.
- `GET /api/addresses` – View all addresses.

### Orders

- `POST /api/orders` – Place an order.
- `GET /api/orders` – View order history.

### Admin

- `POST /api/admin/categories` – Create a category with image upload.
- `GET /api/admin/customers` – View all customers.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

- Email: support@omorix.com
- GitHub:
