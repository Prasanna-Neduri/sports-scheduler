const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");
const User = require("../models/User");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Signup form
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send("All fields are required.");
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.send("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "player",
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Signup failed.");
  }
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login form
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
  res.redirect("/dashboard");
}
);
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed.");
    }

    res.redirect("/login");
  });
});
module.exports = router;