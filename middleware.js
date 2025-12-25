const Product = require("./models/Product");
const { productSchema, reviewSchema } = require("./schema");

const validateProduct = (req, res, next) => {
  let { name, img, price, desc } = req.body;
  const { error } = productSchema.validate({ name, img, price, desc });
  if (error) {
    return res.render("error", { err: error });
  }
  next(); // validate hone ke baad next step per chala ajye
};

const validateReview = (req, res, next) => {
  let { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });
  if (error) {
    return res.render("error", { err: error });
  }
  next();
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "please login first");
    return res.redirect("/login");
  }
  next();
};

const isSeller = (req, res, next) => {
  if (!req.user.role) {
    req.flash("error", "please do not have the permission");
    return res.redirect("/products");
  } else if (req.user.role != "seller") {
    req.flash("error", "please do not have the permission");
    return res.redirect("/products");
  }
  next();
};

const isProductAuthor = async (req, res, next) => {
  let { id } = req.params; // product id
  let product = await Product.findById(id);
  if (!product.author.equals(req.user._id)) {
    req.flash("error", "You are not the authorize user");
    return res.redirect("/products");
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const Review = require('./models/Review');
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect('back');
  }
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the authorize user");
    return res.redirect("/products");
  }
  next();
};

module.exports = {
  validateProduct,
  validateReview,
  isLoggedIn,
  isSeller,
  isProductAuthor,
  isReviewAuthor,
};
