const express = require("express");
const router = express.Router();

const Session = require("../models/Session");
const Sport = require("../models/Sport");
const isAuthenticated = require("../middleware/auth");
const SessionPlayer = require("../models/SessionPlayer");

// Show all sessions
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const sessions = await Session.findAll({
  include: [
    {
      model: Sport,
      as: "sport",
    },
    {
      model: require("../models/User"),
      as: "players",
      attributes: ["id", "name"],
    },
  ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    res.render("sessions", {
      sessions,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load sessions.");
  }
});

// Show create session page
router.get("/create", isAuthenticated, async (req, res) => {
  try {
    const sports = await Sport.findAll();

    res.render("create-session", {
      sports,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load sports.");
  }
});

// Create a session
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const {
      sportId,
      date,
      startTime,
      endTime,
      maxPlayers,
    } = req.body;

    await Session.create({
      sportId,
      date,
      startTime,
      endTime,
      maxPlayers,
      createdBy: req.user.id,
      cancelled: false,
    });

    res.send("Session created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create session.");
  }
});

// Show edit session page
router.get("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).send("Session not found.");
    }

    if (session.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).send("You can only edit your own sessions.");
    }

    const sports = await Sport.findAll();

    res.render("edit-session", {
      session,
      sports,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load session.");
  }
});

// Update session
router.post("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const {
      sportId,
      date,
      startTime,
      endTime,
      maxPlayers,
    } = req.body;

    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).send("Session not found.");
    }

    if (session.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).send("You can only edit your own sessions.");
    }

    session.sportId = sportId;
    session.date = date;
    session.startTime = startTime;
    session.endTime = endTime;
    session.maxPlayers = maxPlayers;

    await session.save();

    res.send("Session updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update session.");
  }
});

// Join a session
router.post("/:id/join", isAuthenticated, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).send("Session not found.");
    }

    if (session.cancelled) {
      return res.send("This session has been cancelled.");
    }

    const existingPlayer = await SessionPlayer.findOne({
      where: {
        userId: req.user.id,
        sessionId: session.id,
      },
    });

    if (existingPlayer) {
      return res.send("You have already joined this session.");
    }

    const playerCount = await SessionPlayer.count({
      where: {
        sessionId: session.id,
      },
    });

    if (playerCount >= session.maxPlayers) {
      return res.send("This session is full.");
    }

    await SessionPlayer.create({
      userId: req.user.id,
      sessionId: session.id,
    });

    res.send("Session joined successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to join session.");
  }
});

// Show sessions joined by the current user
router.get("/joined", isAuthenticated, async (req, res) => {
  try {
    const user = await req.user.getJoinedSessions({
      include: [
        {
          model: Sport,
          as: "sport",
        },
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    res.render("joined-sessions", {
      sessions: user,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load joined sessions.");
  }
});

// Cancel a session
router.post("/:id/cancel", isAuthenticated, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).send("Session not found.");
    }

    // Only the person who created the session can cancel it
    if (session.createdBy !== req.user.id) {
      return res.status(403).send("You can only cancel sessions you created.");
    }

    if (session.cancelled) {
      return res.send("This session is already cancelled.");
    }

    const { cancellationReason } = req.body;

    if (!cancellationReason || cancellationReason.trim() === "") {
      return res.status(400).send("Cancellation reason is required.");
    }

    session.cancelled = true;
    session.cancellationReason = cancellationReason;

    await session.save();

    res.send("Session cancelled successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to cancel session.");
  }
});

module.exports = router;