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
