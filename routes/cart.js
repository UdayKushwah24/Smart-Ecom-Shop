const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router(); // mini instance or mini server
const { isLoggedIn } = require("../middleware");

// route to see the cart
router.get('/user/cart', isLoggedIn, async (req, res) => {
    try {
        let user = await User.findById(req.user._id).populate('cart');
        res.render('cart/cart', { user });
    } catch (e) {
        req.flash('error', 'Error loading cart');
        res.redirect('/products');
    }
});

// actually adding the product to the cart
router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
    try {
        let { productId } = req.params;
        let userId = req.user._id;
        let product = await Product.findById(productId);
        
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }
        
        let user = await User.findById(userId);
        
        // Check if product is already in cart
        const existingItem = user.cart.find(item => item.toString() === productId);
        if (existingItem) {
            req.flash('info', 'Product is already in your cart');
        } else {
            user.cart.push(product);
            await user.save();
            req.flash('success', `${product.name} added to cart successfully!`);
        }
        
        res.redirect('/user/cart');
    } catch (e) {
        console.error('Error adding to cart:', e);
        req.flash('error', 'Error adding product to cart');
        res.redirect('/products');
    }
});

// Remove item from cart
router.post("/user/cart/:productId/remove", isLoggedIn, async (req, res) => {
    try {
        let { productId } = req.params;
        let userId = req.user._id;
        let user = await User.findById(userId);
        
        user.cart = user.cart.filter(item => item.toString() !== productId);
        await user.save();
        
        req.flash('success', 'Item removed from cart');
        res.redirect('/user/cart');
    } catch (e) {
        console.error('Error removing from cart:', e);
        req.flash('error', 'Error removing item from cart');
        res.redirect('/user/cart');
    }
});

// Clear entire cart
router.post("/user/cart/clear", isLoggedIn, async (req, res) => {
    try {
        let userId = req.user._id;
        let user = await User.findById(userId);
        
        user.cart = [];
        await user.save();
        
        req.flash('success', 'Cart cleared successfully');
        res.redirect('/user/cart');
    } catch (e) {
        console.error('Error clearing cart:', e);
        req.flash('error', 'Error clearing cart');
        res.redirect('/user/cart');
    }
});

// Payment success page
router.get('/user/cart/success', isLoggedIn, async (req, res) => {
    try {
        // In a real application, you would verify the payment here
        let userId = req.user._id;
        let user = await User.findById(userId);
        
        // Clear the cart after successful payment
        user.cart = [];
        await user.save();
        
        req.flash('success', 'Payment successful! Your order has been placed.');
        res.render('cart/success');
    } catch (e) {
        console.error('Error processing payment success:', e);
        req.flash('error', 'Error processing order');
        res.redirect('/user/cart');
    }
});

module.exports = router;
