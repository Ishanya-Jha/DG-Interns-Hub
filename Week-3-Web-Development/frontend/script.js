/* =========================================================
   FURNISHER'S WEB
   Main Frontend JavaScript
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

/*
   When the Node.js backend is running locally, it will use:

   http://localhost:5000

   Later, if you deploy the backend, change this URL.
*/

const API_URL = "http://localhost:5000/api";


/* =========================================================
   2. COMMON HELPERS
   ========================================================= */


/*
   Find an element safely.

   Example:
   const button = getElement("login-btn");
*/
function getElement(id) {
    return document.getElementById(id);
}


/*
   Format numbers as Indian Rupees.

   Example:
   formatPrice(24999)

   Result:
   ₹24,999
*/
function formatPrice(price) {
    return "₹" + Number(price || 0).toLocaleString("en-IN");
}


/*
   Get cart from browser localStorage.

   localStorage allows the cart to remain available
   while the user moves between pages.
*/
function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("furnishers_cart")
        ) || [];

    } catch (error) {

        console.error("Could not read cart:", error);

        return [];
    }
}


/*
   Save cart to localStorage.
*/
function saveCart(cart) {

    localStorage.setItem(
        "furnishers_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/*
   Calculate total quantity in cart.
*/
function getCartCount() {

    const cart = getCart();

    return cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
}


/*
   Update cart number in navbar.
*/
function updateCartCount() {

    const cartCount = getElement("cart-count");

    if (cartCount) {
        cartCount.textContent = getCartCount();
    }
}


/*
   Show a message inside an element.
*/
function showMessage(element, message, type = "") {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}


/* =========================================================
   3. MOBILE NAVIGATION
   ========================================================= */

function setupMobileMenu() {

    const menuToggle = getElement("menu-toggle");
    const navLinks = getElement("nav-links");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("show");

    });
}


/* =========================================================
   4. LOGIN STATE
   ========================================================= */


/*
   Store logged-in customer information.

   Backend authentication will later replace the
   temporary frontend logic.
*/
function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem("furnishers_user")
        ) || null;

    } catch (error) {

        return null;
    }
}


/*
   Save customer login information.
*/
function saveLoggedInUser(user) {

    localStorage.setItem(
        "furnishers_user",
        JSON.stringify(user)
    );
}


/*
   Remove login information.
*/
function logoutUser() {

    localStorage.removeItem("furnishers_user");

    window.location.href = "index.html";
}


/* =========================================================
   5. PRODUCT API
   ========================================================= */


/*
   Get all products from backend.

   The backend will eventually respond with:

   GET /api/products
*/
async function getProducts() {

    try {

        const response = await fetch(
            `${API_URL}/products`
        );

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        const products = await response.json();

        return products;

    } catch (error) {

        console.error("Product API error:", error);

        return [];
    }
}


/*
   Get one product by ID.

   GET /api/products/:id
*/
async function getProductById(id) {

    try {

        const response = await fetch(
            `${API_URL}/products/${id}`
        );

        if (!response.ok) {
            throw new Error("Product not found.");
        }

        return await response.json();

    } catch (error) {

        console.error("Single product API error:", error);

        return null;
    }
}


/* =========================================================
   6. PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const productId = product.id;

    const name = product.name || "Furniture Product";

    const price = Number(product.price || 0);

    const salePrice = Number(
        product.sale_price || 0
    );

    const image = product.image ||
        "images/product-placeholder.jpg";

    const category = product.category ||
        "Furniture";

    let priceHTML = formatPrice(price);

    if (salePrice > 0 && salePrice < price) {

        priceHTML = `
            <span style="text-decoration: line-through; color:#888;">
                ${formatPrice(price)}
            </span>
            <br>
            <strong>
                ${formatPrice(salePrice)}
            </strong>
        `;
    }

    return `
        <article class="product-card">

            <div class="product-image-wrapper">

                ${
                    salePrice > 0 && salePrice < price
                    ? `<span class="sale-badge">SALE</span>`
                    : ""
                }

                <img
                    src="${image}"
                    alt="${name}"
                    class="product-image"
                    onerror="this.src='images/product-placeholder.jpg'"
                >

            </div>

            <div class="product-card-content">

                <span class="product-category">
                    ${category}
                </span>

                <h3>
                    ${name}
                </h3>

                <div class="product-price">
                    ${priceHTML}
                </div>

                <a
                    href="product.html?id=${productId}"
                    class="btn btn-primary">
                    View Product
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   7. PRODUCTS PAGE
   ========================================================= */

async function initializeProductsPage() {

    const productGrid = getElement("product-grid");

    if (!productGrid) {
        return;
    }

    const productStatus = getElement("product-status");

    const searchInput = getElement("product-search");

    const categoryFilter = getElement("category-filter");

    const emptyProducts = getElement("empty-products");

    const clearFilters = getElement("clear-filters");


    if (productStatus) {
        productStatus.textContent = "Loading products...";
    }


    const products = await getProducts();

    /*
       If backend isn't running yet, show a useful message.
    */
    if (products.length === 0) {

        productGrid.innerHTML = "";

        if (productStatus) {
            productStatus.textContent =
                "Products will appear here when the backend is connected.";
        }

        if (emptyProducts) {
            emptyProducts.hidden = false;
        }

        return;
    }


    /*
       Create category options dynamically.
    */
    if (categoryFilter) {

        const categories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];

        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category;

            option.textContent = category;

            categoryFilter.appendChild(option);

        });
    }


    function displayProducts() {

        const searchTerm =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                : "all";


        const filteredProducts = products.filter(
            product => {

                const name =
                    (product.name || "").toLowerCase();

                const category =
                    (product.category || "").toLowerCase();

                const matchesSearch =
                    name.includes(searchTerm) ||
                    category.includes(searchTerm);

                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category === selectedCategory;

                return matchesSearch && matchesCategory;

            }
        );


        productGrid.innerHTML = "";


        if (filteredProducts.length === 0) {

            if (emptyProducts) {
                emptyProducts.hidden = false;
            }

            if (productStatus) {
                productStatus.textContent =
                    "No products match your search.";
            }

            return;
        }


        if (emptyProducts) {
            emptyProducts.hidden = true;
        }


        if (productStatus) {

            productStatus.textContent =
                `${filteredProducts.length} product(s) found`;

        }


        filteredProducts.forEach(product => {

            productGrid.insertAdjacentHTML(
                "beforeend",
                createProductCard(product)
            );

        });

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            displayProducts
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            displayProducts
        );

    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                categoryFilter.value = "all";

                displayProducts();

            }
        );

    }


    displayProducts();
}


/* =========================================================
   8. PRODUCT DETAILS PAGE
   ========================================================= */

async function initializeProductPage() {

    const productContainer =
        getElement("product-detail-container");

    if (!productContainer) {
        return;
    }


    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id");


    if (!productId) {

        productContainer.innerHTML = `
            <div class="empty-state">
                <h3>Product not found</h3>

                <p>
                    No product was selected.
                </p>

                <a
                    href="products.html"
                    class="btn btn-primary">
                    Browse Products
                </a>
            </div>
        `;

        return;
    }


    const product =
        await getProductById(productId);


    if (!product) {

        productContainer.innerHTML = `
            <div class="empty-state">

                <h3>
                    Product unavailable
                </h3>

                <p>
                    We could not load this product.
                </p>

                <a
                    href="products.html"
                    class="btn btn-primary">
                    Back to Shop
                </a>

            </div>
        `;

        return;
    }


    const image =
        getElement("product-image");

    const category =
        getElement("product-category");

    const name =
        getElement("product-name");

    const price =
        getElement("product-price");

    const description =
        getElement("product-description");


    if (image) {

        image.src =
            product.image ||
            "images/product-placeholder.jpg";

        image.alt =
            product.name;

    }


    if (category) {
        category.textContent =
            product.category || "Furniture";
    }


    if (name) {
        name.textContent =
            product.name;
    }


    if (price) {

        const regularPrice =
            Number(product.price || 0);

        const salePrice =
            Number(product.sale_price || 0);

        if (
            salePrice > 0 &&
            salePrice < regularPrice
        ) {

            price.innerHTML = `
                <span style="text-decoration: line-through; color:#888;">
                    ${formatPrice(regularPrice)}
                </span>
                <br>
                ${formatPrice(salePrice)}
            `;

        } else {

            price.textContent =
                formatPrice(regularPrice);

        }

    }


    if (description) {

        description.textContent =
            product.description ||
            "Quality furniture designed for modern living.";

    }


    const addButton =
        getElement("add-to-cart");

    const quantityInput =
        getElement("product-quantity");

    const colourSelect =
        getElement("product-colour");

    const cartMessage =
        getElement("cart-message");


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                const quantity =
                    Math.max(
                        1,
                        Number(
                            quantityInput
                                ? quantityInput.value
                                : 1
                        )
                    );


                const colour =
                    colourSelect
                        ? colourSelect.value
                        : "Default";


                addToCart(
                    product,
                    quantity,
                    colour
                );


                showMessage(
                    cartMessage,
                    `${product.name} added to your cart.`,
                    "success"
                );

            }
        );

    }
}


/* =========================================================
   9. ADD TO CART
   ========================================================= */

function addToCart(
    product,
    quantity = 1,
    colour = "Default"
) {

    const cart = getCart();


    const existingItem =
        cart.find(
            item =>
                Number(item.id) === Number(product.id) &&
                item.colour === colour
        );


    const price =
        Number(
            product.sale_price > 0 &&
            product.sale_price < product.price
                ? product.sale_price
                : product.price
        );


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({

            id: Number(product.id),

            name: product.name,

            price: price,

            image:
                product.image ||
                "images/product-placeholder.jpg",

            category:
                product.category ||
                "Furniture",

            colour: colour,

            quantity: quantity

        });

    }


    saveCart(cart);
}


/* =========================================================
   10. CART PAGE
   ========================================================= */

function initializeCartPage() {

    const cartItems =
        getElement("cart-items");

    if (!cartItems) {
        return;
    }


    const emptyCart =
        getElement("empty-cart");

    const summaryItems =
        getElement("summary-items");

    const subtotalElement =
        getElement("cart-subtotal");

    const deliveryElement =
        getElement("cart-delivery");

    const totalElement =
        getElement("cart-total");

    const itemCountElement =
        getElement("cart-item-count");

    const checkoutButton =
        getElement("checkout-btn");


    function renderCart() {

        const cart =
            getCart();


        cartItems.innerHTML = "";


        if (cart.length === 0) {

            if (emptyCart) {
                emptyCart.hidden = false;
            }

            if (summaryItems) {
                summaryItems.textContent = "0";
            }

            if (subtotalElement) {
                subtotalElement.textContent =
                    formatPrice(0);
            }

            if (deliveryElement) {
                deliveryElement.textContent =
                    formatPrice(0);
            }

            if (totalElement) {
                totalElement.textContent =
                    formatPrice(0);
            }

            if (itemCountElement) {
                itemCountElement.textContent =
                    "0 items";
            }

            if (checkoutButton) {
                checkoutButton.disabled = true;
            }

            return;
        }


        if (emptyCart) {
            emptyCart.hidden = true;
        }


        let subtotal = 0;

        let totalQuantity = 0;


        cart.forEach((item, index) => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);

            subtotal += itemTotal;

            totalQuantity +=
                Number(item.quantity);


            const itemHTML = `

                <article class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        class="cart-item-image"
                        onerror="this.src='images/product-placeholder.jpg'"
                    >

                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ${item.category}
                        </p>

                        <p>
                            Colour:
                            ${item.colour || "Default"}
                        </p>

                        <div class="cart-quantity">

                            <button
                                type="button"
                                data-action="decrease"
                                data-index="${index}">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-action="increase"
                                data-index="${index}">
                                +
                            </button>

                        </div>

                    </div>

                    <div>

                        <p class="cart-item-price">
                            ${formatPrice(itemTotal)}
                        </p>

                        <button
                            type="button"
                            class="remove-cart-item"
                            data-action="remove"
                            data-index="${index}">
                            Remove
                        </button>

                    </div>

                </article>

            `;


            cartItems.insertAdjacentHTML(
                "beforeend",
                itemHTML
            );

        });


        /*
           Delivery rule:

           Orders above ₹50,000:
           Free delivery

           Other orders:
        /*
           Delivery rule:

           Orders above ₹50,000:
           Free delivery

           Other orders:
           ₹499 delivery
        */

        const delivery =
            subtotal >= 50000
                ? 0
                : 499;

        const total =
            subtotal + delivery;


        if (summaryItems) {
            summaryItems.textContent =
                totalQuantity;
        }


        if (subtotalElement) {
            subtotalElement.textContent =
                formatPrice(subtotal);
        }


        if (deliveryElement) {
            deliveryElement.textContent =
                delivery === 0
                    ? "Free"
                    : formatPrice(delivery);
        }


        if (totalElement) {
            totalElement.textContent =
                formatPrice(total);
        }


        if (itemCountElement) {
            itemCountElement.textContent =
                `${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`;
        }


        if (checkoutButton) {
            checkoutButton.disabled = false;
        }


        cartItems.querySelectorAll("[data-action]").forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(button.dataset.index);

                        const action =
                            button.dataset.action;

                        const currentCart =
                            getCart();


                        if (!currentCart[index]) {
                            return;
                        }


                        if (action === "increase") {

                            currentCart[index].quantity++;

                        }


                        if (action === "decrease") {

                            currentCart[index].quantity--;

                            if (
                                currentCart[index].quantity <= 0
                            ) {
                                currentCart.splice(index, 1);
                            }

                        }


                        if (action === "remove") {

                            currentCart.splice(index, 1);

                        }


                        saveCart(currentCart);

                        renderCart();

                    }
                );

            }
        );

    }


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                const cart =
                    getCart();

                if (cart.length === 0) {
                    return;
                }


                const user =
                    getLoggedInUser();


                if (!user) {

                    window.location.href =
                        "login.html?redirect=checkout";

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }


    renderCart();

}


/* =========================================================
   11. LOGIN PAGE
   ========================================================= */

function initializeLoginPage() {

    const form =
        getElement("login-form");

    if (!form) {
        return;
    }


    const emailInput =
        getElement("login-email");

    const passwordInput =
        getElement("login-password");

    const message =
        getElement("login-message");

    const loginButton =
        getElement("login-btn");


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showMessage(
                    message,
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            if (loginButton) {
                loginButton.disabled = true;
                loginButton.textContent = "Logging in...";
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/users/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Invalid email or password."
                    );

                }


                saveLoggedInUser(data.user);


                showMessage(
                    message,
                    "Login successful. Redirecting...",
                    "success"
                );


                const params =
                    new URLSearchParams(
                        window.location.search
                    );


                const redirect =
                    params.get("redirect");


                setTimeout(
                    function () {

                        window.location.href =
                            redirect === "checkout"
                                ? "checkout.html"
                                : "dashboard.html";

                    },
                    500
                );


            } catch (error) {

                showMessage(
                    message,
                    error.message,
                    "error"
                );

            } finally {

                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = "Login";
                }

            }

        }
    );


    const forgotPassword =
        getElement("forgot-password");


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showMessage(
                    message,
                    "Password recovery is not included in this internship MVP.",
                    "info"
                );

            }
        );

    }

}


/* =========================================================
   12. SIGNUP PAGE
   ========================================================= */

function initializeSignupPage() {

    const form =
        getElement("signup-form");

    if (!form) {
        return;
    }


    const nameInput =
        getElement("signup-name");

    const emailInput =
        getElement("signup-email");

    const passwordInput =
        getElement("signup-password");

    const confirmPasswordInput =
        getElement("signup-confirm-password");

    const message =
        getElement("signup-message");

    const signupButton =
        getElement("signup-btn");


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            if (!name || !email || !password) {

                showMessage(
                    message,
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;

            }


            if (signupButton) {
                signupButton.disabled = true;
                signupButton.textContent = "Creating account...";
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/users/register`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to create account."
                    );

                }


                showMessage(
                    message,
                    "Account created successfully. Redirecting to login...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    800
                );


            } catch (error) {

                showMessage(
                    message,
                    error.message,
                    "error"
                );

            } finally {

                if (signupButton) {
                    signupButton.disabled = false;
                    signupButton.textContent = "Create Account";
                }

            }

        }
    );

}


/* =========================================================
   13. CHECKOUT PAGE
   ========================================================= */

function initializeCheckoutPage() {

    const form =
        getElement("checkout-form");

    if (!form) {
        return;
    }


    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html?redirect=checkout";

        return;

    }


    const cart =
        getCart();


    if (cart.length === 0) {

        window.location.href =
            "cart.html";

        return;

    }


    const nameInput =
        getElement("checkout-name");

    const emailInput =
        getElement("checkout-email");

    const phoneInput =
        getElement("checkout-phone");

    const addressInput =
        getElement("checkout-address");

    const cityInput =
        getElement("checkout-city");

    const stateInput =
        getElement("checkout-state");

    const pincodeInput =
        getElement("checkout-pincode");

    const notesInput =
        getElement("checkout-notes");

    const message =
        getElement("checkout-message");


    if (nameInput) {
        nameInput.value = user.name || "";
    }


    if (emailInput) {
        emailInput.value = user.email || "";
    }


    const itemsContainer =
        getElement("checkout-items");


    if (itemsContainer) {

        itemsContainer.innerHTML = "";

        cart.forEach(item => {

            itemsContainer.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="checkout-item">
                        <span>
                            ${item.name} × ${item.quantity}
                        </span>

                        <strong>
                            ${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}
                        </strong>
                    </div>
                `
            );

        });

    }


    const totals =
        calculateCartTotals();


    const itemCount =
        getElement("checkout-item-count");

    const subtotalElement =
        getElement("checkout-subtotal");

    const deliveryElement =
        getElement("checkout-delivery");

    const totalElement =
        getElement("checkout-total");


    if (itemCount) {
        itemCount.textContent =
            totals.quantity;
    }


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(totals.subtotal);
    }


    if (deliveryElement) {
        deliveryElement.textContent =
            totals.delivery === 0
                ? "Free"
                : formatPrice(totals.delivery);
    }


    if (totalElement) {
        totalElement.textContent =
            formatPrice(totals.total);
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !nameInput.value.trim() ||
                !emailInput.value.trim() ||
                !phoneInput.value.trim() ||
                !addressInput.value.trim() ||
                !cityInput.value.trim() ||
                !stateInput.value.trim() ||
                !pincodeInput.value.trim()
            ) {

                showMessage(
                    message,
                    "Please complete all required billing details.",
                    "error"
                );

                return;

            }


            const checkoutData = {

                name:
                    nameInput.value.trim(),

                email:
                    emailInput.value.trim(),

                phone:
                    phoneInput.value.trim(),

                address:
                    addressInput.value.trim(),

                city:
                    cityInput.value.trim(),

                state:
                    stateInput.value.trim(),

                pincode:
                    pincodeInput.value.trim(),

                notes:
                    notesInput
                        ? notesInput.value.trim()
                        : ""

            };


            localStorage.setItem(
                "furnishers_checkout",
                JSON.stringify(checkoutData)
            );


            window.location.href =
                "payment.html";

        }
    );

}


/* =========================================================
   14. CART TOTAL CALCULATOR
   ========================================================= */

function calculateCartTotals() {

    const cart =
        getCart();


    let subtotal = 0;

    let quantity = 0;


    cart.forEach(item => {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

        quantity +=
            Number(item.quantity || 0);

    });


    const delivery =
        subtotal >= 50000
            ? 0
            : cart.length > 0
                ? 499
                : 0;


    return {

        subtotal:
            subtotal,

        delivery:
            delivery,

        total:
            subtotal + delivery,

        quantity:
            quantity

    };

}


/* =========================================================
   15. PAYMENT PAGE
   ========================================================= */

function initializePaymentPage() {

    const form =
        getElement("payment-form");

    if (!form) {
        return;
    }


    const user =
        getLoggedInUser();

    const cart =
        getCart();


    if (!user) {

        window.location.href =
            "login.html?redirect=checkout";

        return;

    }


    if (cart.length === 0) {

        window.location.href =
            "cart.html";

        return;

    }


    const checkoutData =
        JSON.parse(
            localStorage.getItem(
                "furnishers_checkout"
            )
        ) || {};


    const paymentMessage =
        getElement("payment-message");

    const paymentSubmit =
        getElement("payment-submit");


    const cardFields =
        getElement("card-payment-fields");

    const upiFields =
        getElement("upi-payment-fields");

    const codFields =
        getElement("cod-payment-fields");


    const paymentMethods =
        document.querySelectorAll(
            'input[name="payment-method"]'
        );


    function updatePaymentFields() {

        const selected =
            document.querySelector(
                'input[name="payment-method"]:checked'
            );


        const method =
            selected
                ? selected.value
                : "card";


        if (cardFields) {
            cardFields.hidden =
                method !== "card";
        }


        if (upiFields) {
            upiFields.hidden =
                method !== "upi";
        }


        if (codFields) {
            codFields.hidden =
                method !== "cod";
        }

    }


    paymentMethods.forEach(
        input => {

            input.addEventListener(
                "change",
                updatePaymentFields
            );

        }
    );


    updatePaymentFields();


    const totals =
        calculateCartTotals();


    const itemContainer =
        getElement("payment-items");


    if (itemContainer) {

        itemContainer.innerHTML = "";

        cart.forEach(item => {

            itemContainer.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="checkout-item">

                        <span>
                            ${item.name} × ${item.quantity}
                        </span>

                        <strong>
                            ${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}
                        </strong>

                    </div>
                `
            );

        });

    }


    const itemCount =
        getElement("payment-item-count");

    const subtotalElement =
        getElement("payment-subtotal");

    const deliveryElement =
        getElement("payment-delivery");

    const totalElement =
        getElement("payment-total");


    if (itemCount) {
        itemCount.textContent =
            totals.quantity;
    }


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(totals.subtotal);
    }


    if (deliveryElement) {
        deliveryElement.textContent =
            totals.delivery === 0
                ? "Free"
                : formatPrice(totals.delivery);
    }


    if (totalElement) {
        totalElement.textContent =
            formatPrice(totals.total);
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const selected =
                document.querySelector(
                    'input[name="payment-method"]:checked'
                );


            const method =
                selected
                    ? selected.value
                    : "card";


            if (method === "card") {

                const cardNumber =
                    getElement("card-number");

                const cardExpiry =
                    getElement("card-expiry");

                const cardCVV =
                    getElement("card-cvv");


                if (
                    !cardNumber.value.trim() ||
                    !cardExp
