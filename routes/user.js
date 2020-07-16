const express = require('express')
const user = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
require('dotenv').config()

user.use(cors())

user.post('/register', async (req, res) => {
   try {
        const userData = {
            username: req.body.username,
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            cname: req.body.cname,
            role: req.body.role,
            email: req.body.email,
            password: req.body.password,
            img: req.body.img,
            identity_number: req.body.identity_number,
            address: req.body.address,
            status: req.body.status
        }

        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!user) {
            const hash = bcrypt.hash(userData.password, 10)
            userData.password = hash

            user = await User.create(userData)

            if (user) {
                const token = jwt.sign(userData.dataValues, process.env.SECRET_KEY, { expiresIn: 1440 })
                res.json({ token })
            }
        } else {
            res.status(400).send("User already exist")
        }
   } catch(err) {
       res.status(500).send(err)
   }
})

user.get('/login', async (req, res) => {
    const decoded = jwt.verify(req.header['x-auth'], proccess.env.PORT)

    if (!decoded) res.status(401).send("Invalid token")

    res.status(200).send("Loged in successfuly")
})

module.exports = user;