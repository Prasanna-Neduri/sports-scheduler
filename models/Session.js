const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Session = sequelize.define("Session", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  cancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Session;