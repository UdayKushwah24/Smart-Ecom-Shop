const express = require("express");
const Product = require("../models/Product");
const Review = require("../models/Review");
const router = express.Router(); // mini instance or mini server
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
router.post("/products/:id/review", isLoggedIn, validateReview, async (req, res) => {
    try {
        let { id } = req.params;
        // console.log(id);
        let { rating, comment } = req.body;
        let product = await Product.findById(id);
        const review = new Review({ rating, comment, author: req.user._id });
        product.reviews.push(review);
        await review.save();
        await product.save();
        // req.flash('msg', "Review added successfully");
        req.flash('success', "Review added successfully");
        res.redirect(`/products/${id}`);
    } catch (e) {
        res.status(500).render("error", { err: e.massage });
    }
});

// delete a review (only author can delete)
router.delete('/products/:id/review/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/products/${id}`);
  } catch (e) {
    res.status(500).render('error', { err: e });
  }
});

module.exports = router;
