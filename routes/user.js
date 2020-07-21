const express = require('express')
const user = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const _ = require('underscore')
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
            const hash = await bcrypt.hash(userData.password, 10)
            userData.password = hash;

            user = await User.create(userData)

            if (user) {
                const token = jwt.sign(_.pick(userData, 'username', 'email'), process.env.SECRET_KEY, { 
                    expiresIn: 1440 
                })

                res.status(200).json({ token })
            }
        } else {
            res.status(400).send("User already exist")
        }
   } catch(err) {
       res.status(500).send(err)
   }
})

user.post('/login', async (req, res) => {
    const userData = _.pick(req.body, 'username', 'email', 'password')

    const user = await User.findOne({
        where: {
            email: userData.email
        }
    })

    if (!user) return res.status(404).send("Invalid email or password!")
  
    const validPass = await bcrypt.compare(userData.password, user.password)
    if (!validPass) return res.status(404).send("Invalid email or password!")

    const token = jwt.sign(_.pick(userData, 'username', 'email'), process.env.SECRET_KEY, {
        expiresIn: 1440
    })

    res.status(200).send({ token })
})

user.post('/me', async (req, res) => {
    const decoded = jwt.verify(req.headers['x-auth'], process.env.SECRET_KEY)

    const user = await User.findOne({
        where: {
            email: decoded.email
        }
    })

    if (!user) return res.status(401).send("Access deniend!")
    
    res.status(200).json(user)
})

module.exports = user;