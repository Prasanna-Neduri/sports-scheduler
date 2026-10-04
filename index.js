require("dotenv").config();

require("./models/associations");

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sports Scheduler running on port ${PORT}`);
});