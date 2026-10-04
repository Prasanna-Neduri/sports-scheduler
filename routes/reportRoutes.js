const express = require("express");
const { Op } = require("sequelize");

const router = express.Router();

const Session = require("../models/Session");
const Sport = require("../models/Sport");
const isAuthenticated = require("../middleware/auth");

// Admin reports
router.get("/", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied.");
    }

    const { startDate, endDate } = req.query;

    let where = {
      cancelled: false,
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Total sessions
    const totalSessions = await Session.count({
      where,
    });

    // Popularity of each sport
    const sessions = await Session.findAll({
      where,
      include: [
        {
          model: Sport,
          as: "sport",
        },
      ],
      order: [["date", "ASC"]],
    });

    const sportPopularity = {};

    sessions.forEach((session) => {
      const sportName = session.sport.name;

      if (!sportPopularity[sportName]) {
        sportPopularity[sportName] = 0;
      }

      sportPopularity[sportName]++;
    });

    res.render("reports", {
      totalSessions,
      sportPopularity,
      startDate,
      endDate,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load reports.");
  }
});

module.exports = router;