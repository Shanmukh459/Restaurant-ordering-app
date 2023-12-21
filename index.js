import menuArray from "/data.js"

const menuSection = document.getElementById("menu")
menuSection.innerHTML = getMenuHtml()

document.addEventListener("click", function(e) {
    if(e.target.dataset.item) {
        addItemToCart(e.target.dataset.item)
    }
    else if (e.target.dataset.remove) {
        removeItemFromCart(e.target.dataset.remove)
    }
    else if (e.target.dataset.submitCart) {
        proceedToPay()
    }
    else if (e.target.dataset.pay) {
        e.preventDefault()
        const payFormData = new FormData(document.getElementById("payment-form"))
        // console.log(payFormData.get("cardholder-name"))
        hidePaymentDialog()
        displayOrderConfirmation(payFormData.get("cardholder-name"))
    }
})


function addItemToCart(item) {   
    const el = menuArray.filter(menuItem => menuItem.name === item)
    el[0].quantity++
    renderCart()
}

function removeItemFromCart(item) {
    const el = menuArray.filter(cartItem => cartItem.name === item)
    el[0].quantity = 0
    renderCart()
}

function proceedToPay() {
    document.getElementById("payment-modal").innerHTML = getPaymentModalHtml()
}

function displayOrderConfirmation(name) { 
    clearCart()
    document.getElementById("order-confirmation").innerHTML = orderConfirmationHtml(name)
}

function renderCart() {
    document.getElementById("cart").innerHTML = getCartHtml()
}

function clearCart() {
    document.getElementById("cart").innerHTML = ""
}

function hidePaymentDialog() {
    document.getElementById("payment-modal").style.display = "none"
}

function getMenuHtml() {
    return menuArray.map(function(menuItem) {
        const { name, ingredients, price, emoji } = menuItem
        return `
            <div class="menu-item">
                <div class="item-details">
                    <div class="item-emoji">
                        ${emoji}
                    </div>
                    <div>
                        <p class="item-name">${name}</p>
                        <p class="item-ingredients">${ingredients}</p>
                        <p class="item-price">$${price}</p>
                    </div>
                </div>
                <div>
                    <button class="plus-icon" data-item="${name}">+</button>
                </div>
            </div>`
    }).join('')
}


function getCartHtml() {
    let cartTotal = 0
    const cartItems = menuArray.map(item => {
        if (item.quantity){
            cartTotal += item.price * item.quantity
            return `
                <div class="cart-item">
                    <div class="item-name-btn">
                        <p>${item.name}</p>
                        <button class="remove-btn" data-remove="${item.name}">remove</button>
                    </div>
                    <div>
                        <p class="cart-item-price">$${item.price * item.quantity} ( ${item.quantity} )</p>
                    </div>
                </div>
            `
        }
    }).join('')
    
    return `
        <h2 class="cart-header">Your Order</h2>
        <div class="cart-items">
            ${cartItems}
        </div>
        <div class="cart-total">
            <p>Total price:</p>
            <p>$${cartTotal}</p>
        </div>
        <button class="submit-btn" id="submit-cart" data-submit-cart="submit-cart">Complete Order</button>
    `
}

function getPaymentModalHtml() {
    return `
        <form class="payment-inner" id="payment-form">
            <h4>Enter card details</h4>
            <input 
                type="text" 
                placeholder="Enter your name" 
                name="cardholder-name"
                required
            >
            <input 
                placeholder="Enter card number" 
                name="card-number"
                required 
                maxlength="16" 
                type="text" 
                inputmode="numeric" 
                pattern="[0-9\s]{13,19}"
            >
            <input 
                type="password" 
                name="card-cvv"
                placeholder="Enter CVV" 
                maxlength="3" 
                required
            >
            <button class="submit-btn" data-pay="pay">Pay</button>
        </form>
    `
}

function orderConfirmationHtml(name) {
    return `
        <div class="order-confirmation-inner">
            <p>Thanks, ${name}! Your order is on its way!</p>
        </div>
    `
}