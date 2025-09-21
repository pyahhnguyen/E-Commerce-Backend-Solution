// MongoDB initialization script for development
// This script runs when MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the application database
db = db.getSiblingDB('shopDev');

// Create application user with read/write permissions
db.createUser({
  user: 'ShopDEV',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'shopDev'
    }
  ]
});

// Create indexes for better performance
print('Creating indexes...');

// Product collection indexes
db.products.createIndex({ "product_name": "text", "product_description": "text" });
db.products.createIndex({ "product_shop": 1 });
db.products.createIndex({ "product_type": 1 });
db.products.createIndex({ "isPublished": 1 });
db.products.createIndex({ "isDraft": 1 });

// Shop collection indexes
db.shops.createIndex({ "email": 1 }, { unique: true });

// Cart collection indexes
db.carts.createIndex({ "cart_userId": 1 });

// Order collection indexes
db.orders.createIndex({ "order_userId": 1 });
db.orders.createIndex({ "order_status": 1 });

// Discount collection indexes
db.discounts.createIndex({ "discount_code": 1 }, { unique: true });
db.discounts.createIndex({ "discount_shopId": 1 });

print('MongoDB initialization completed successfully!');
