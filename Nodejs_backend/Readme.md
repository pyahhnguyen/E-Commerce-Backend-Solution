# E-Commerce Express-MongoDB

## Description
A robust e-commerce backend built with Express.js and MongoDB, providing RESTful APIs for product management, user authentication, shopping cart operations, and order processing.

## Technologies Used
- Node.js (v14+)
- Express.js (v4.x)
- MongoDB (v4.4+)
- JSON Web Token (JWT)
- Bcrypt
- Mongoose
- Express Validator
- Dotenv

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)
- Git

## Installation

Install dependencies
```bash
npm install
```

## Project Structure
``` bash 
├── auth/           # Authentication related code
├── configs/        # Configuration files
├── controllers/    # Request handlers
├── core/          # Core application logic
├── helpers/       # Helper functions
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
├── .env           # Environment variables
├── .gitignore     # Git ignore file
├── app.js         # Application entry point
└── package.json   # Project dependencies
```

## API Endpoints
### Authentication

POST /api/auth/register - Register new user

POST /api/auth/login - User login

POST /api/auth/logout - User logout

### Products
GET /api/products - Get all products

GET /api/products/:id - Get single product

POST /api/products - Create product

PUT /api/products/:id - Update product

DELETE /api/products/:id - Delete product

### Orders
GET /api/orders - Get all orders

POST /api/orders - Create order

GET /api/orders/:id - Get order details

PUT /api/orders/:id - Update order

### Cart
GET /api/cart - Get cart

POST /api/cart - Add to cart

PUT /api/cart/:id - Update cart item

DELETE /api/cart/:id - Remove from cart


## License
This project is licensed under the MIT License - see the LICENSE file for details.

