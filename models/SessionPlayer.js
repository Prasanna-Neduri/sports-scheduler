const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SessionPlayer = sequelize.define("SessionPlayer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = SessionPlayer;