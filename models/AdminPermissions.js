const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define('admins_permissions', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        add_adv: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        },
        edit_adv: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        },
        add_case: {
            type: Sequelize.TINYINT,
            defaultValue: 1
        },
        edit_case: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        }
    },
    {
        timestamps: false
    }
)