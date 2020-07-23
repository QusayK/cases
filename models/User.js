const Sequelize = require('sequelize')
const db = require('../database/db')
const jwt = require('jsonwebtoken')

const User = db.sequelize.define( 'user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        fname: {
            type: Sequelize.STRING
        },
        mname: {
            type: Sequelize.STRING
        },
        lname: {
            type: Sequelize.STRING
        },
        cname: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: { 
                isEmail: true 
            }
        },
        password: {
            type: Sequelize.STRING
        },
        img: {
            type: Sequelize.STRING
        },
        identity_number: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.TINYINT,
            defaultVAlue: 1
        }
    },
    {
        timestamps: false
    }
)

User.prototype.generateToken = (user) => {
    return token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { 
        expiresIn: 1440 
    })
}

module.exports = User