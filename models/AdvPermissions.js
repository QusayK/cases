const Sequelize = require('sequelize')
const db = require('../database/db')

module.exports = db.sequelize.define('advocates_permissions', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
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