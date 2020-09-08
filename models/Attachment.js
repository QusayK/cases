const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define("attachment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  attachment: {
    type: Sequelize.STRING,
  },
  who_added_it: {
    type: Sequelize.INTEGER,
  },
  case_id: {
    type: Sequelize.INTEGER,
  },
  manager_id: {
    type: Sequelize.INTEGER,
  },
});
