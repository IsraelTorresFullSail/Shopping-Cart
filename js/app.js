// Singleton Creational Design Pattern
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

// Getting the products
class Products {
    constructor(ui){
        this.ui = new UI();
        this.ui.openCloseCart();
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
            })
            .catch( err => {
                console.log(err);
            })
    }
}

// vars to use in UI
let slideIndex = 0;
let slideArray = [];

// Display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach( product => {
            result +=`
                <div class="product-card">
                    <p class="p-small">${product.company}</p>
                    <h2>${product.name}</h2>
                    <img src=${product.image} alt=${product.name}>
                    <p class="price">${product.price}</p>
                    <button class="btn-preview" data-company="${product.company}" data-name="${product.name}" data-image="${product.image}" data-price="${product.price}" data-description="${product.description}">Preview</button>
                    <button class="add" data-id=${product.id}><i class="fas fa-plus"></i></button>
                </div>
            `
        });
        document.querySelector('.product-grid').innerHTML = result;
    }
    
    prodDefault(products) {
        let slides = '';
        slides += `
                <img src=${products[0].image} alt=${products[0].name}>
                <div class="product-description">
                    <h3 class="company-name">${products[0].company}</h3>
                    <h1>${products[0].name}</h1>
                    <h3 class="review">138 reviews</h3>
                    <h2 class="desc-price">${products[0].price}</h2>
                    <p class="desc">${products[0].description}</p>
                </div>
            `
        document.querySelector('.product-info').innerHTML = slides;
    }

    openCloseCart() {
        let open = document.querySelector('.cart');
        let close = document.querySelector('.close');

        open.addEventListener('click', function(){
            document.querySelector('.shopping-cart').style.width = '460px';
            document.querySelector('.layer').style.width = '100%';
        })

        close.addEventListener('click', function(){
            document.querySelector('.shopping-cart').style.width = '0px';
            document.querySelector('.layer').style.width = '0';
        })
    }
}


// Product Preview
document.querySelector('.product-grid').addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-preview')) {
        const prodInfo = document.querySelector('.product-info');
        prodInfo.querySelector('img').src = e.target.dataset.image;
        prodInfo.querySelector('.company-name').textContent = e.target.dataset.company;
        prodInfo.querySelector('h1').textContent = e.target.dataset.name;
        prodInfo.querySelector('h2').textContent = e.target.dataset.price;
        prodInfo.querySelector('.desc').textContent = e.target.dataset.description;
        
    }
});

