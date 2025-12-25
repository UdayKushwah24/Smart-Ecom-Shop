const mongoose = require('mongoose');

const Product = require('./models/Product')

 
const products = [
  {
    name: "Iphone 14 pro",
    img: "https://images.unsplash.com/photo-1726732970014-f2df88c87dd3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwcHJvfGVufDB8fDB8fHww",
    price: 130000,
    desc: "very costly, you can not buy it",
  },
  {
    name: "Macbook m2 pro",
    img: "https://images.unsplash.com/photo-1659135890084-930731031f40?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFjYm9vayUyMG0yfGVufDB8fDB8fHww",
    price: 250000,
    desc: "Not able to buy it..",
  },
  {
    name: "I watch",
    img: "https://images.unsplash.com/photo-1729044320112-7fad57c029ed?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEklMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
    price: 51000,
    desc: "with affordable price,",
  },
  {
    name: "I pad pro",
    img: "https://images.unsplash.com/photo-1662731340473-0a29611314b2?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGklMjBwYWQlMjBwcm98ZW58MHx8MHx8fDA%3D",
    price: 200000,
    desc: "Life mai kuch cheej apple ki bhi use karo",
  },
  {
    name: "airpods",
    img: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D",
    price: 25000,
    desc: "with affordable price,paisa kamao",
  },
];

async function seedDB() {
    await Product.insertMany(products); // returns a promise
    console.log("data seeded successfully");
}

module.exports = seedDB;