require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const sportRoutes = require("./routes/sportRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reportRoutes = require("./routes/reportRoutes");


const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/", authRoutes);
app.use("/sports", sportRoutes);
app.use("/sessions", sessionRoutes);
app.use("/reports", reportRoutes);

app.get("/", (req, res) => {
  res.render("home");
});
module.exports = app;