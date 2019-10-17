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
class Products {
    constructor(ui, storage){
        this.ui = new UI();
        this.ui.openCloseCart();
        this.ui.productPreview();
        this.ui.addItemsToCart();
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
            //document.querySelector('.shopping-cart').style.width = '375px';
            document.querySelector('.shopping-cart').classList.add('showCart');
        })

        close.addEventListener('click', function(){
            //document.querySelector('.shopping-cart').style.width = '0px';
            document.querySelector('.shopping-cart').classList.remove('showCart');
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
        const btnsAddToCart = [...document.querySelectorAll('add')];

        btnsAddToCart.forEach(btns => {
            let id = btns.dataset.id;
            console.log(id);
            
        })
    }
}

// --------------------------- Local Storage --------------------------- //
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
}




