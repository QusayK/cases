const express = require('express')
const auth = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const _ = require('lodash')

auth.post('/', async (req, res) => {
    const userData = _.pick(req.body, 'username', 'password')

    const user = await User.findOne({
        where: {
            username: userData.username
        }
    })

    if (!user) return res.status(400).send("Invalid username or password!")
  
    const validPass = await bcrypt.compare(userData.password, user.password)
    if (!validPass) return res.status(400).send("Invalid username or password!")

    const token =  user.generateToken(user)

    res.status(200).header('x-auth', token).send(_.pick(user, ['id', 'username', 'email']))
})

module.exports = auth;