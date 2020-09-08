const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "cases_advocates",
  {
    case_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    adv_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);
