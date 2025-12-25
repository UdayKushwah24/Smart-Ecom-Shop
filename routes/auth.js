const express = require("express");
const User = require("../models/User");
const passport = require('passport')
const { isLoggedIn } = require("../middleware");
const router = express.Router(); // mini instance or mini server
 

router.get('/register', (req, res) => {
    try {
      res.render("auth/signup");
    } catch (e) {
      res.status(500).render("error", { err: e });
    }
})

// Add signup route as well for compatibility
router.get('/signup', (req, res) => {
    try {
      res.render("auth/signup");
    } catch (e) {
      res.status(500).render("error", { err: e });
    }
})

// actually want to register a user in my db
router.post('/register', async (req, res, next) => {
    try {
        let { username, password, email, role } = req.body;
        
        // Basic validation
        if (!username || !password || !email || !role) {
            req.flash("error", "All fields are required");
            return res.redirect('/register');
        }
        
        console.log("Registration attempt:", { username, email, role });
        
        const user = new User({ username, email, role });
        const newUser = await User.register(user, password);
        
        console.log("User registered successfully:", newUser.username);
        
        req.login(newUser, function (err) {
            if (err) {
                console.error("Login after registration error:", err);
                return next(err);
            }
            req.flash('success',`Welcome ${username}, you are registered successfully!`)
            // Redirect to home page instead of products page
            return res.redirect("/");
        })
    } catch (e) {
        console.error("Registration error:", e);
        let errorMessage = "Registration failed. Please try again.";
        
        // Handle specific error cases
        if (e.name === 'UserExistsError') {
            errorMessage = "A user with the given username is already registered";
        } else if (e.name === 'ValidationError') {
            errorMessage = e.message;
        }
        
        req.flash("error", errorMessage);
        return res.redirect('/register')
  }
})



// to get login form
router.get("/login", (req, res) => {
    try {
      res.render("auth/login");
    } catch (e) {
      res.status(500).render("error", { err: e });
    }
});

// user profile
router.get('/profile', isLoggedIn, (req, res) => {
  try {
    res.render('users/profile', { user: req.user });
  } catch (e) {
    res.status(500).render('error', { err: e });
  }
});

 
// to actually login via the db
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(req.user);
    let { username } = req.user;

    req.flash("success", `Welcome back, ${username}!`);
    res.redirect("/");
  }
);



// logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/products");
    }
    req.flash("success", "Goodbye! See you again soon.");
    res.redirect("/login");
  });
});




module.exports = router;
