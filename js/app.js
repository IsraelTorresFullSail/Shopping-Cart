// Singleton Creational Design Pattern
window.addEventListener("load", function() {
    console.log("Page Loaded");
    // Instantiate Singleton
    var myShoppingCart = ShoppingCart.getInstance();
});

class ShoppingCart {
    constructor() {
        console.log("Singleton Created");
        var controller = new Controller();
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

class Controller {
    constructor(model, view) {
        console.log("Controller Created");
        this.model = new Model();
        this.view = new View();
    }
}

class Model {
    constructor(id, name, description, price, image) {
        console.log("Model Created");
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }
}

class View {
    constructor() {
        console.log("View Created");
        
    }
}