const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define('admin', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        manager_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    },
    {
        timestamps: false
    }
)