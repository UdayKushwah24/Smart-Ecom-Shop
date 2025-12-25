const express = require("express");
const router = express.Router(); // mini instance or mini server
const Product = require("../models/Product");
const Review = require("../models/Review");

const {
  validateProduct,
  isLoggedIn,
  isSeller,
  isProductAuthor,
} = require("../middleware");
// display all the products
router.get("/products",isLoggedIn, async (req, res) => {
  try {
    let products = await Product.find({});
    res.render("products/index.ejs", { products });
  } catch (e) {
    res.status(500).render("error", { err: e });
    // res.status(500).render("error", { err: e.message });
  }
});

// show form to add new product
router.get("/product/new", isLoggedIn, (req, res) => {
  try {
    res.render("products/new.ejs");
  } catch (e) {
    res.status(500).render("error", { err: e });
  }
});

// after adding new product, to update the database
router.post("/products", validateProduct, isLoggedIn, isSeller, async (req, res) => {
  try {
    let { name, img, price, desc } = req.body;
    // res.send(name)
    await Product.create({ name, img, price, desc, author:req.user._id });
    req.flash("success", "Product added successfully");
    res.redirect("/products");
  } catch (e) {
    res.status(500).render("error", { err: e });
  }
});

// show particular product
router.get("/products/:id", isLoggedIn, async (req, res) => {
  try {
    let { id } = req.params;
    // let foundProduct = await Product.findById(id);
    let foundProduct = await Product.findById(id).populate({ path: 'reviews', populate: { path: 'author' } });
    // console.log(foundProduct);

    res.render("products/show.ejs", { foundProduct, msg: req.flash("msg") });
  } catch (e) {
    res.status(500).render("error", { err: e });
  }
});

// show form to edit  the product
router.get(
  "/products/:id/edit",
  isLoggedIn,
  isProductAuthor,
  async (req, res) => {
    try {
      let { id } = req.params;
      let foundProduct = await Product.findById(id);
      res.render("products/edit", { foundProduct });
    } catch (e) {
      res.status(500).render("error", { err: e });
    }
  }
);

// to update the product
router.patch("/products/:id", validateProduct, isLoggedIn,isProductAuthor, async (req, res) => {
  try {
    let { id } = req.params;
    let { name, img, price, desc } = req.body;
    await Product.findByIdAndUpdate(id, { name, img, price, desc });
    req.flash("success", "Product edited successfully");
    res.redirect(`/products/${id}`);
  } catch (e) {
    res.status(500).render("error", { err: e });
  }
});

// delete the prduct
router.delete(
  "/products/:id",
  isLoggedIn,
  isProductAuthor,
  async (req, res) => {
    try {
      let { id } = req.params;
      // let product = await Product.findById(id);
      // for (let idd of product.reviews) {
      //   await Review.findByIdAndDelete(idd);
      // }

      let product = await Product.findById(id);
      req.flash("success", "Product deleted successfully");
      await Product.findByIdAndDelete(id);
      res.redirect("/products");
    } catch (e) {
      res.status(500).render("error", { err: e });
    }
  }
);

module.exports = router;
