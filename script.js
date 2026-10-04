
// ================================
// SHOP EASE - MAIN JAVASCRIPT
// ================================

// PRODUCT DATA
const products = {
    headphones: {
        id: "headphones",
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        oldPrice: 1899,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },

    shoes: {
        id: "shoes",
        name: "Running Shoes",
        category: "Footwear",
        price: 2199,
        oldPrice: 2599,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },

    handbag: {
        id: "handbag",
        name: "Classic Handbag",
        category: "Fashion",
        price: 1299,
        oldPrice: 1699,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
    },

    watch: {
        id: "watch",
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        oldPrice: 3499,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    }
};

// ================================
// CART
// ================================

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];
} catch (error) {
    cart = [];
}

function saveCart() {
    localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll(".cart-count");

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCounts.forEach(count => {
        count.textContent = totalQuantity;
    });
}

// ADD PRODUCT TO CART
function addToCart(productId, quantity = 1) {
    const product = products[productId];

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    renderCart();
    updateCartCount();
    updateCartSummary();

    showCartPopup(product.name);
}

// ================================
// ADD TO CART BUTTONS
// ================================

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();

        const productCard = this.closest(".product-card");

        if (!productCard) {
            console.error("Product card not found");
            return;
        }

        const productId = productCard.dataset.product;

        addToCart(productId, 1);
    });
});

// ================================
// CART POPUP
// ================================

function showCartPopup(productName) {
    const oldPopup = document.querySelector(".cart-popup");

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup = document.createElement("div");
    popup.className = "cart-popup";

    const check = document.createElement("span");
    check.className = "popup-check";
    check.textContent = "✓";

    const details = document.createElement("div");

    const heading = document.createElement("strong");
    heading.textContent = "Added to Cart!";

    const name = document.createElement("p");
    name.textContent = productName;

    details.appendChild(heading);
    details.appendChild(name);

    popup.appendChild(check);
    popup.appendChild(details);

    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.classList.add("show");
    });

    setTimeout(() => {
        popup.classList.remove("show");

        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 2500);
}

// ================================
// DISPLAY CART ITEMS
// ================================

function renderCart() {
    const cartItems = document.getElementById("cart-items");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty. Add some products!
            </p>
        `;
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="cart-quantity">
                    <button class="cart-minus" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-plus" data-id="${item.id}">+</button>
                </div>
            </div>

            <div class="cart-item-right">
                <strong>
                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>

                <button class="cart-remove" data-id="${item.id}">
                    Remove
                </button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    updateCartSummary();
}

// ================================
// CART QUANTITY AND REMOVE
// ================================

document.addEventListener("click", function(event) {
    const plusButton = event.target.closest(".cart-plus");
    const minusButton = event.target.closest(".cart-minus");
    const removeButton = event.target.closest(".cart-remove");

    if (plusButton) {
        const id = plusButton.dataset.id;
        const item = cart.find(product => product.id === id);

        if (item) {
            item.quantity++;
            saveCart();
            renderCart();
            updateCartCount();
        }
    }

    if (minusButton) {
        const id = minusButton.dataset.id;
        const item = cart.find(product => product.id === id);

        if (item) {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }

            saveCart();
            renderCart();
            updateCartCount();
        }
    }

    if (removeButton) {
        const id = removeButton.dataset.id;

        cart = cart.filter(product => product.id !== id);

        saveCart();
        renderCart();
        updateCartCount();
    }
});

// ================================
// CART TOTAL
// ================================

function updateCartSummary() {
    const subtotalElement = document.getElementById("cart-subtotal");
    const deliveryElement = document.getElementById("cart-delivery");
    const totalElement = document.getElementById("cart-total");

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
    const total = subtotal + delivery;

    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    }

    if (deliveryElement) {
        deliveryElement.textContent =
            delivery === 0 ? "Free" : `₹${delivery}`;
    }

    if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString("en-IN")}`;
    }
}

// ================================
// CART ICON
// ================================

document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", function() {
        const cartSection = document.getElementById("cart");

        if (cartSection) {
            cartSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// ================================
// WISHLIST
// ================================

document.querySelectorAll(".wishlist").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();

        this.classList.toggle("active");

        if (this.classList.contains("active")) {
            this.textContent = "♥";
        } else {
            this.textContent = "♡";
        }
    });
});

// ================================
// SEARCH PRODUCTS
// ================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const searchText = this.value.toLowerCase().trim();

        document.querySelectorAll(".product-card").forEach(card => {
            const name = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const category = card.querySelector(".product-category")?.textContent.toLowerCase() || "";

            card.style.display =
                name.includes(searchText) || category.includes(searchText)
                    ? ""
                    : "none";
        });
    });
}

// ================================
// CATEGORY FILTER
// ================================

document.querySelectorAll("[data-category]").forEach(categoryButton => {
    categoryButton.addEventListener("click", function() {
        const selectedCategory = this.dataset.category.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {
            const category =
                card.querySelector(".product-category")?.textContent.toLowerCase() || "";

            card.style.display =
                selectedCategory === "all" || category === selectedCategory
                    ? ""
                    : "none";
        });

        const productsSection = document.getElementById("products");

        if (productsSection) {
            productsSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// ================================
// PRODUCT DETAILS MODAL
// ================================

const productModal = document.getElementById("productModal");
let selectedProduct = null;
let modalQuantity = 1;

function openProductModal(productId) {
    const product = products[productId];

    if (!product || !productModal) return;

    selectedProduct = productId;
    modalQuantity = 1;

    const image = document.getElementById("modalProductImage");
    const category = document.getElementById("modalCategory");
    const name = document.getElementById("modalProductName");
    const rating = document.getElementById("modalRating");
    const description = document.getElementById("modalDescription");
    const price = document.getElementById("modalPrice");
    const oldPrice = document.getElementById("modalOldPrice");
    const quantity = document.getElementById("modalQuantity");

    if (image) image.src = product.image;
    if (category) category.textContent = product.category;
    if (name) name.textContent = product.name;
    if (rating) rating.textContent = `⭐ ${product.rating}`;
    if (description) {
        description.textContent =
            `Explore our ${product.name}. A great choice at an affordable price.`;
    }
    if (price) price.textContent = `₹${product.price.toLocaleString("en-IN")}`;
    if (oldPrice) oldPrice.textContent = `₹${product.oldPrice.toLocaleString("en-IN")}`;
    if (quantity) quantity.textContent = modalQuantity;

    productModal.style.display = "flex";
}

document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", function(event) {
        if (event.target.closest("button")) return;

        const productId = this.dataset.product;
        openProductModal(productId);
    });
});

const closeModal = document.getElementById("closeModal");

if (closeModal) {
    closeModal.addEventListener("click", function() {
        if (productModal) productModal.style.display = "none";
    });
}

if (productModal) {
    productModal.addEventListener("click", function(event) {
        if (event.target === productModal) {
            productModal.style.display = "none";
        }
    });
}

// MODAL QUANTITY BUTTONS

const modalMinus = document.getElementById("modalMinus");
const modalPlus = document.getElementById("modalPlus");
const modalQuantityElement = document.getElementById("modalQuantity");

if (modalMinus) {
    modalMinus.addEventListener("click", function() {
        if (modalQuantity > 1) {
            modalQuantity--;
            if (modalQuantityElement) {
                modalQuantityElement.textContent = modalQuantity;
            }
        }
    });
}

if (modalPlus) {
    modalPlus.addEventListener("click", function() {
        modalQuantity++;
        if (modalQuantityElement) {
            modalQuantityElement.textContent = modalQuantity;
        }
    });
}

// ADD FROM MODAL

const modalAddCart = document.getElementById("modalAddCart");

if (modalAddCart) {
    modalAddCart.addEventListener("click", function() {
        if (selectedProduct) {
            addToCart(selectedProduct, modalQuantity);

            if (productModal) {
                productModal.style.display = "none";
            }
        }
    });
}

// ================================
// CHECKOUT BUTTON
// ================================

const checkoutButton = document.querySelector(".checkout-btn");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function() {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add a product first.");
            return;
        }

        window.location.href = "checkout.html";
    });
}

// ================================
// NAVIGATION LINKS
// ================================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// ================================
// INITIAL LOAD
// ================================

renderCart();
updateCartCount();
updateCartSummary();
