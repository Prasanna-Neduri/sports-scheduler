require("dotenv").config();

const sequelize = require("./config/database");

require("./models/associations");

const app = require("./app");

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("All database tables created successfully!");

    app.listen(PORT, () => {
      console.log(`Sports Scheduler running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });