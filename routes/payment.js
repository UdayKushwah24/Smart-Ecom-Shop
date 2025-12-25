const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isLoggedIn } = require("../middleware");

// Create payment intent (Demo version)
router.post("/create-payment-intent", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart");

    // Calculate total amount
    let totalAmount = 0;
    user.cart.forEach((item) => {
      totalAmount += parseFloat(item.price) || 0;
    });

    // Add tax (10%)
    totalAmount = totalAmount * 1.1;

    // Convert to cents for payment processing
    const amountInCents = Math.round(totalAmount * 100);

    // Demo payment intent (replace with real Stripe integration in production)
    const mockPaymentIntent = {
      id: "pi_demo_" + Math.random().toString(36).substring(7),
      client_secret:
        "pi_demo_client_secret_" + Math.random().toString(36).substring(7),
      amount: amountInCents,
      currency: "usd",
      status: "requires_payment_method",
    };

    res.json({
      clientSecret: mockPaymentIntent.client_secret,
      amount: totalAmount,
      paymentIntentId: mockPaymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Handle payment success (Demo version)
router.post("/payment-success", isLoggedIn, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Demo: assume payment succeeded
    const user = await User.findById(req.user._id);
    const cartItems = [...user.cart];

    // Clear the cart after successful payment
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Payment processed successfully",
      orderItems: cartItems,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// Get payment status (Demo version)
router.get("/payment-status/:paymentIntentId", isLoggedIn, async (req, res) => {
  try {
    // Demo: always return success status
    res.json({ status: "succeeded" });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
});

module.exports = router;
