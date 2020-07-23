const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define('phone', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        phone_number: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)