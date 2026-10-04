const User = require("./User");
const Sport = require("./Sport");
const Session = require("./Session");
const SessionPlayer = require("./SessionPlayer");

// User creates Sessions
User.hasMany(Session, {
  foreignKey: "createdBy",
  as: "createdSessions",
});

Session.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

// Sport has Sessions
Sport.hasMany(Session, {
  foreignKey: "sportId",
  as: "sessions",
});

Session.belongsTo(Sport, {
  foreignKey: "sportId",
  as: "sport",
});

// Users join Sessions
User.belongsToMany(Session, {
  through: SessionPlayer,
  foreignKey: "userId",
  otherKey: "sessionId",
  as: "joinedSessions",
});

Session.belongsToMany(User, {
  through: SessionPlayer,
  foreignKey: "sessionId",
  otherKey: "userId",
  as: "players",
});

module.exports = {
  User,
  Sport,
  Session,
  SessionPlayer,
};