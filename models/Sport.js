const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sport = sequelize.define("Sport", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Sport;