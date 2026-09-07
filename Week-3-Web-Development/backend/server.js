const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Furnisher's Web backend is running!"
    });
});

// --------------------------------------------------
// GET ALL PRODUCTS
// --------------------------------------------------

app.get("/api/products", (req, res) => {

    const sql = `
        SELECT 
            id,
            name,
            price,
            image,
            category,
            description,
            sale_price
        FROM products
        ORDER BY id DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {
            console.error("Error fetching products:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch products"
            });
        }

        res.json({
            success: true,
            products: results
        });
    });
});

// --------------------------------------------------
// GET SINGLE PRODUCT
// --------------------------------------------------

app.get("/api/products/:id", (req, res) => {

    const productId = req.params.id;

    const sql = `
        SELECT 
            id,
            name,
            price,
            image,
            category,
            description,
            sale_price
        FROM products
        WHERE id = ?
    `;

    db.query(sql, [productId], (error, results) => {

        if (error) {
            console.error("Error fetching product:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch product"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product: results[0]
        });
    });
});

// --------------------------------------------------
// REGISTER USER
// --------------------------------------------------

app.post("/api/users/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    const checkSql = `
        SELECT id 
        FROM users 
        WHERE email = ?
    `;

    db.query(checkSql, [email], (checkError, results) => {

        if (checkError) {
            console.error("User check error:", checkError);

            return res.status(500).json({
                success: false,
                message: "Unable to create account"
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const insertSql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertSql,
            [name, email, password],
            (insertError, result) => {

                if (insertError) {
                    console.error("User registration error:", insertError);

                    return res.status(500).json({
                        success: false,
                        message: "Unable to create account"
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Account created successfully",
                    user: {
                        id: result.insertId,
                        name: name,
                        email: email
                    }
                });
            }
        );
    });
});

// --------------------------------------------------
// LOGIN USER
// --------------------------------------------------

app.post("/api/users/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [email, password], (error, results) => {

        if (error) {
            console.error("Login error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to login"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: results[0]
        });
    });
});

// --------------------------------------------------
// PLACE ORDER
// --------------------------------------------------

app.post("/api/orders", (req, res) => {

    const {
        user_id,
        payment_method,
        checkout,
        items
    } = req.body;

    if (!user_id || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "User and cart items are required"
        });
    }

    const orderNumber =
        "FUR-" +
        Date.now().toString().slice(-8);

    let completed = 0;
    let failed = false;

    items.forEach((item) => {

        const sql = `
            INSERT INTO orders
            (
                user_id,
                product_id,
                quantity,
                order_number,
                payment_method,
                customer_phone,
                customer_address,
                customer_city,
                customer_state,
                customer_pincode,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id,
            item.product_id,
            item.quantity,
            orderNumber,
            payment_method || "Not selected",
            checkout?.phone || "",
            checkout?.address || "",
            checkout?.city || "",
            checkout?.state || "",
            checkout?.pincode || "",
            checkout?.notes || ""
        ];

        db.query(sql, values, (error) => {

            if (failed) {
                return;
            }

            if (error) {
                failed = true;

                console.error("Order error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to place order"
                });
            }

            completed++;

            if (completed === items.length) {

                res.status(201).json({
                    success: true,
                    message: "Order placed successfully",
                    order_number: orderNumber
                });
            }
        });
    });
});

// --------------------------------------------------
// SERVER START
// --------------------------------------------------

app.listen(PORT, () => {

    console.log(
        `Furnisher's Web backend running on http://localhost:${PORT}`
    );

});
