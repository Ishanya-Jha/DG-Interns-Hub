CREATE DATABASE IF NOT EXISTS ecommerce_db;

USE ecommerce_db;

-- --------------------------------------------------
-- USERS TABLE
-- --------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- --------------------------------------------------
-- PRODUCTS TABLE
-- --------------------------------------------------

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    sale_price DECIMAL(10,2) DEFAULT 0
);

-- --------------------------------------------------
-- ORDERS TABLE
-- --------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    order_number VARCHAR(50),
    payment_method VARCHAR(50),
    customer_phone VARCHAR(20),
    customer_address VARCHAR(255),
    customer_city VARCHAR(100),
    customer_state VARCHAR(100),
    customer_pincode VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- --------------------------------------------------
-- SAMPLE PRODUCTS
-- --------------------------------------------------

INSERT INTO products
(name, price, image, category, description, sale_price)
VALUES

(
    'Modern Sofa',
    45000,
    'images/sofa.jpg',
    'Sofa',
    'A comfortable modern sofa designed for stylish living rooms.',
    39999
),

(
    'Classic Dining Table',
    38000,
    'images/dining-table.jpg',
    'Tables',
    'Elegant dining table with a spacious wooden top.',
    32999
),

(
    'Ergonomic Office Chair',
    18000,
    'images/office-chair.jpg',
    'Chairs',
    'Comfortable ergonomic chair suitable for work and study.',
    14999
),

(
    'King Size Bed',
    55000,
    'images/bed.jpg',
    'Beds',
    'Premium king-size bed with a strong wooden frame.',
    49999
),

(
    'Premium Wardrobe',
    42000,
    'images/wardrobe.jpg',
    'Storage',
    'Spacious wardrobe with modern storage compartments.',
    37999
),

(
    'Wooden Bookshelf',
    16000,
    'images/bookshelf.jpg',
    'Storage',
    'Minimal wooden bookshelf for books and decorative items.',
    13999
),

(
    'Coffee Table',
    14000,
    'images/coffee-table.jpg',
    'Tables',
    'Compact coffee table designed for modern living spaces.',
    11999
),

(
    'Modern TV Unit',
    28000,
    'images/tv-unit.jpg',
    'Storage',
    'Modern TV unit with storage space and clean design.',
    23999
);
