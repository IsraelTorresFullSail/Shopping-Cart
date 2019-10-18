// --------------------------- Singleton Creational Design Pattern --------------------------- //
window.addEventListener("load", function() {
    console.log("Page Loaded");
    // Instantiate Singleton
    var myShoppingCart = ShoppingCart.getInstance();
});

class ShoppingCart {
    constructor() {
        console.log("Singleton Created");

        // get all products
        const products = new Products();
        products.getProducts();

        //Storage.saveProducts(products.getProducts());
    }

    static getInstance() {
        // Is there an instance variable attached to the class?
        // If SO! Don't Create. If NOT, then it's ok tto Create!
        if (!ShoppingCart._instance) {
            ShoppingCart._instance = new ShoppingCart();
            return ShoppingCart._instance;
        }
        else {
            throw "Sinful! Trying to create a second Singleton!";
        }
    }
}

// --------------------------- Getting the Products --------------------------- //
// Cart
let cart = [];
let buttonsDOM = [];

class Products {
    constructor(ui, storage){
        this.ui = new UI();
        this.ui.openCloseCart();
        this.ui.productPreview();
        this.ui.addItemsToCart();
        this.ui.cartLogic();
    }
    getProducts() {
        fetch('/js/products.json')
            .then( response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then( data => {
                this.ui.displayProducts(data);
                this.ui.prodDefault(data);
                Storage.saveProducts(data);
            })
            .catch( err => {
                console.log(err);
            })
    }
}

// --------------------------- Display Products --------------------------- //
// vars to use in UI
let slideIndex = 0;
let slideArray = [];

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach( product => {
            result +=`
                <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3 newpadding">
                    <div class="product-card ">
                        <p class="p-small">${product.company}</p>
                        <h2>${product.name}</h2>
                        <img src=${product.image} alt=${product.name}>
                        <p class="price">$${product.price}</p>
                        <button class="btn-preview" data-company="${product.company}" data-name="${product.name}" data-image="${product.image}" data-review="${product.review} reviews" data-price="$${product.price}" data-description="${product.description}">Preview</button>
                        <button class="add" data-id=${product.id}><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            `
        });
        document.querySelector('.product-grid').innerHTML = result;
    }
    
    prodDefault(products) {
        let slides = '';
        slides += `
            <div class="container">
                <img src=${products[0].image} alt=${products[0].name}>
                <div class="product-description">
                    <h3 class="company-name">${products[0].company}</h3>
                    <h1>${products[0].name}</h1>
                    <h3 class="review">${products[0].review} reviews</h3>
                    <h2 class="desc-price">$${products[0].price}</h2>
                    <p class="desc">${products[0].description}</p>
                </div>
            </div>
            `
        document.querySelector('.product-info').innerHTML = slides;
    }

    openCloseCart() {
        let open = document.querySelector('.cart');
        let close = document.querySelector('.close');

        open.addEventListener('click', function(){
            document.querySelector('.shopping-cart').style.width = '375px';
        })

        close.addEventListener('click', function(){
            document.querySelector('.shopping-cart').style.width = '0px';
        })
    }

    productPreview() {
        // Product Preview
        document.querySelector('.product-grid').addEventListener('click', function(e) {
            if(e.target.classList.contains('btn-preview')) {
                const prodInfo = document.querySelector('.product-info');
                prodInfo.querySelector('img').src = e.target.dataset.image;
                prodInfo.querySelector('.company-name').textContent = e.target.dataset.company;
                prodInfo.querySelector('h1').textContent = e.target.dataset.name;
                prodInfo.querySelector('h2').textContent = e.target.dataset.price;
                prodInfo.querySelector('.review').textContent = e.target.dataset.review;
                prodInfo.querySelector('.desc').textContent = e.target.dataset.description;
                
            }
        });
    }

    addItemsToCart() {
        document.querySelector('.product-grid').addEventListener('click', (e) => {
            if(e.target.classList.contains('add')) {

                let btnsAddToCart = e.target;
                buttonsDOM = btnsAddToCart;

                let id = btnsAddToCart.dataset.id;

                let inCart = cart.find(item => item.id === id);

                if(inCart) {
                    btnsAddToCart.setAttribute('disabled', '');
                }
                else {
                    // get product from products
                    let cartItem = {...Storage.getProduct(id), amount:1};

                    // add product the cart
                    cart = [...cart, cartItem];

                    // save cart in local storage
                    Storage.saveCart(cart);

                    // set cart values
                    this.setCartValues(cart);

                    // display cart item
                    let itemsInCart = JSON.parse(localStorage.getItem('cart'));
                    this.createCartItem(itemsInCart);
                }
            }
        })
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        let cartItems = document.querySelector('.number p');
        let cartTotal = document.querySelector('.cartTotal');
        let shipEst = document.querySelector('.shipEst');
        let orderTotal = document.querySelector('.orderTotal');
        
        cartItems.innerText = itemsTotal;
        cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
        shipEst.innerText = `$${parseFloat((tempTotal * 0.05).toFixed(2))}`;
        orderTotal.innerText = `$${parseFloat((tempTotal + (tempTotal * 0.05)).toFixed(2))}`;
    }

    createCartItem(item) {
        let result = '';
        item.forEach( i => {
            result += `
                <div class='prod-cart'>
                    <div class="row">
                        <div class="col-3">
                            <img src=${i.image} alt=${i.image}>
                        </div>
                        <div class="col-5">
                            <div class="prod-name">
                                <h2>${i.name}</h2>
                                <button class="btn-remove" data-id=${i.id}>Remove</button>
                            </div>
                        </div>
                        <div class="col-2 price-cart">
                            <h2>$${i.price}</h2>
                        </div>
                        <div class="col-2 number-items">
                            <button class="add-amount"><i class="fas fa-plus" data-id=${i.id}></i></button>
                            <h3>${i.amount}</h3>
                            <button class="lower-amount"><i class="fas fa-minus" data-id=${i.id}></i></button>
                        </div>
                    </div>
                </div>
            `
        });
        document.querySelector('.cont-cart').innerHTML = result;
    }

    cartLogic() {
        // cart functionality
        const cartContent = document.querySelector('.cont-cart');
        cartContent.addEventListener('click', (event) => {
            if(event.target.classList.contains('btn-remove')) {

                let removeItem = event.target;
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement.parentElement.parentElement);

                this.removeItem(id);
            }
            else if(event.target.classList.contains('fa-plus')) {

                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.parentElement.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('fa-minus')) {

                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0) {
                    // Reduce amount
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.parentElement.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    // Remove cart item when amount is 0
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id)
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// --------------------------- Local Storage --------------------------- //
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}




