const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "cases_admins",
  {
    case_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    admin_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);
