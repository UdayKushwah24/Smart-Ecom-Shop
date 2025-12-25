const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport')
const LocalStrategy = require("passport-local");
const User = require('./models/User');

const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");

// let url = "mongodb://127.0.0.1:27017/shop"

let MONGODB_URL = process.env.MONGODB_URL ;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("Error !!", err);
  });

let configsession = {
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(configsession));

// passport configuration
passport.use(new LocalStrategy(User.authenticate));
passport.use(User.createStrategy());
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
 
// Home/Landing page route
app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);


let port = 8080;
app.listen(port, () => {
  console.log(`connected to port ${port} successfully`);
});
