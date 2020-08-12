const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define("case", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  adv_id: {
    type: Sequelize.INTEGER,
  },
  case_type: {
    type: Sequelize.INTEGER,
  },
  desc: {
    type: Sequelize.TEXT,
  },
  cost: {
    type: Sequelize.INTEGER,
  },
  cost_type: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  value: {
    type: Sequelize.INTEGER,
  },
  currency: {
    type: Sequelize.INTEGER,
    defaultValue: 3,
  },
  who_added_it: {
    type: Sequelize.INTEGER,
  },
  manager_id: {
    type: Sequelize.INTEGER,
  },
});
