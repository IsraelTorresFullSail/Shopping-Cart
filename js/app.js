// Singleton Creational Design Pattern
window.addEventListener("load", function() {
    console.log("Page Loaded");
    // Instantiate Singleton
    var myShoppingCart = ShoppingCart.getInstance();
});

class ShoppingCart {
    constructor() {
        console.log("Singleton Created");
        
        const ui = new UI();
        const products = new Products();

        // get all products
        products.getProducts().then(products => ui.displayProducts(products));
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
    async getProducts() {
        try {
            let result = await fetch('/js/products.json');
            let data = await result.json();
                
            let products = data.items;
            products = products.map( item => {
                const {company, name, description, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {company, name, description, price, id, image};
            })
            return products;
        } catch (error) {
            console.log(error);
        }
        
    }
}

// display products
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
                    <button class="add" data-id=${product.id}><i class="fas fa-plus"></i></button>
                </div>
            `
        });
        document.querySelector('.product-grid').innerHTML = result;
    }
}