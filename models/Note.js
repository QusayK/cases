const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define("note", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  case_id: {
    type: Sequelize.INTEGER,
  },
  note: {
    type: Sequelize.STRING,
  },
  attachment: {
    type: Sequelize.STRING,
  },
  who_added_it: {
    type: Sequelize.INTEGER,
  },
  manager_id: {
    type: Sequelize.INTEGER,
  },
});
