const express = require("express");
const router = express.Router();

console.log("sportRoutes.js loaded");

const Sport = require("../models/Sport");
const isAuthenticated = require("../middleware/auth");


// Admin check
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).send("Access denied. Admins only.");
}

// Show create sport page
router.get("/create", isAuthenticated, isAdmin, (req, res) => {
  res.render("create-sport");
});

// Create sport
router.post("/create", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    await Sport.create({
      name,
      description,
    });

    res.send("Sport created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create sport.");
  }
});

// Show edit sport page
router.get("/:id/edit", isAuthenticated, isAdmin, async (req, res) => {
  console.log("EDIT SPORT ROUTE HIT", req.params.id);

  try {
    const sport = await Sport.findByPk(req.params.id);

    if (!sport) {
      return res.status(404).send("Sport not found.");
    }

    res.render("edit-sport", {
      sport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load sport.");
  }
});

// Update sport
router.post("/:id/edit", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const sport = await Sport.findByPk(req.params.id);

    if (!sport) {
      return res.status(404).send("Sport not found.");
    }

    sport.name = name;
    sport.description = description;

    await sport.save();

    res.send("Sport updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update sport.");
  }
});

// Browse all sports
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const sports = await Sport.findAll();

    res.render("sports", {
      sports,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch sports.");
  }
});

module.exports = router;