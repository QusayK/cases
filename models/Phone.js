const Sequelize = require("sequelize");
const db = require("../database/db");

const Phone = db.sequelize.define(
  "phone",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    phone_number: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    role: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Phone;
