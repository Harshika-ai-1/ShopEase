/* ==========================================
   SHOP-EASE - CHECKOUT JAVASCRIPT
   ========================================== */


/* ---------- GET CART ---------- */

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];


/* ---------- ELEMENTS ---------- */

const checkoutContainer =
    document.getElementById("checkoutContainer");

const checkoutEmpty =
    document.getElementById("checkoutEmpty");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutDelivery =
    document.getElementById("checkoutDelivery");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const orderSuccess =
    document.getElementById("orderSuccess");


/* ==========================================
   DISPLAY CART
   ========================================== */

function displayCheckoutCart() {

    /* Check whether cart is empty */

    if (cart.length === 0) {

        if (checkoutContainer) {
            checkoutContainer.style.display = "none";
        }

        if (checkoutEmpty) {
            checkoutEmpty.style.display = "block";
        }

        return;
    }


    /* Show checkout */

    if (checkoutContainer) {
        checkoutContainer.style.display = "block";
    }

    if (checkoutEmpty) {
        checkoutEmpty.style.display = "none";
    }


    /* Display products */

    let subtotal = 0;

    checkoutItems.innerHTML = cart.map(function (item) {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;

        return `
            <div class="checkout-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="checkout-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                </div>

                <div class="checkout-item-price">

                    ₹${itemTotal.toLocaleString("en-IN")}

                </div>

            </div>
        `;

    }).join("");


    /* Delivery charges */

    let delivery = 0;

    if (subtotal > 0 && subtotal < 999) {
        delivery = 49;
    }


    /* Total */

    const total =
        subtotal + delivery;


    /* Display amounts */

    checkoutSubtotal.textContent =
        "₹" + subtotal.toLocaleString("en-IN");

    checkoutDelivery.textContent =
        delivery === 0
            ? "FREE"
            : "₹" + delivery.toLocaleString("en-IN");

    checkoutTotal.textContent =
        "₹" + total.toLocaleString("en-IN");
}


/* ==========================================
   VALIDATE CUSTOMER INFORMATION
   ========================================== */

function validateCustomerInformation() {

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const pincode =
        document.getElementById("pincode").value.trim();

    const state =
        document.getElementById("state").value;


    /* Check empty fields */

    if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        phone === "" ||
        address === "" ||
        city === "" ||
        pincode === "" ||
        state === ""
    ) {

        alert(
            "Please fill in all required fields."
        );

        return false;
    }


    /* Validate email */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        return false;
    }


    /* Validate phone */

    const phonePattern =
        /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return false;
    }


    /* Validate PIN */

    const pinPattern =
        /^[0-9]{6}$/;

    if (!pinPattern.test(pincode)) {

        alert(
            "Please enter a valid 6-digit PIN code."
        );

        return false;
    }


    return true;
}


/* ==========================================
   GET PAYMENT METHOD
   ========================================== */

function getPaymentMethod() {

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selectedPayment) {
        return null;
    }

    return selectedPayment.value;
}


/* ==========================================
   PAYMENT METHOD NAME
   ========================================== */

function getPaymentMethodName(paymentMethod) {

    if (paymentMethod === "cod") {
        return "Cash on Delivery";
    }

    if (paymentMethod === "upi") {
        return "UPI";
    }

    if (paymentMethod === "card") {
        return "Credit / Debit Card";
    }

    return "Not Selected";
}


/* ==========================================
   GENERATE ORDER NUMBER
   ========================================== */

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return "SE-" + randomNumber;
}


/* ==========================================
   PLACE ORDER
   ========================================== */

if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        function () {

            /* Check cart */

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            /* Validate customer information */

            if (!validateCustomerInformation()) {
                return;
            }


            /* Get payment method */

            const paymentMethod =
                getPaymentMethod();

            if (!paymentMethod) {

                alert(
                    "Please select a payment method."
                );

                return;
            }


            /* Calculate total */

            let subtotal = 0;

            cart.forEach(function (item) {

                subtotal +=
                    item.price * item.quantity;

            });


            let delivery = 0;

            if (
                subtotal > 0 &&
                subtotal < 999
            ) {
                delivery = 49;
            }


            const total =
                subtotal + delivery;


            /* Customer name */

            const firstName =
                document
                    .getElementById("firstName")
                    .value
                    .trim();

            const lastName =
                document
                    .getElementById("lastName")
                    .value
                    .trim();


            const customerName =
                firstName + " " + lastName;


            /* Generate order number */

            const orderNumber =
                generateOrderNumber();


            /* Payment name */

            const paymentName =
                getPaymentMethodName(
                    paymentMethod
                );


            /* Display order number */

            const orderNumberElement =
                document.getElementById(
                    "orderNumber"
                );

            if (orderNumberElement) {

                orderNumberElement.textContent =
                    orderNumber;
            }


            /* Display customer */

            const successCustomer =
                document.getElementById(
                    "successCustomer"
                );

            if (successCustomer) {

                successCustomer.textContent =
                    "Thank you, " +
                    customerName +
                    "! Your order has been confirmed.";
            }


            /* Display payment */

            const successPayment =
                document.getElementById(
                    "successPayment"
                );

            if (successPayment) {

                successPayment.textContent =
                    "Payment Method: " +
                    paymentName;
            }


            /* Display total */

            const successTotal =
                document.getElementById(
                    "successTotal"
                );

            if (successTotal) {

                successTotal.textContent =
                    "Total: ₹" +
                    total.toLocaleString("en-IN");
            }


            /* Hide checkout */

            if (checkoutContainer) {

                checkoutContainer.style.display =
                    "none";
            }


            /* Show success */

            if (orderSuccess) {

                orderSuccess.style.display =
                    "block";
            }


            /* Clear cart */

            localStorage.removeItem(
                "shopEaseCart"
            );

            cart = [];


            /* Scroll to success */

            if (orderSuccess) {

                orderSuccess.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* ==========================================
   INITIAL LOAD
   ========================================== */

displayCheckoutCart();