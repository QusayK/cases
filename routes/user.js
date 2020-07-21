const express = require('express')
const user = express.Router()
const auth = require('../middlewares/auth')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const _ = require('lodash')
const { update } = require('lodash')
require('dotenv').config()

user.use(cors())

user.get('/me', auth, async (req, res) => {
    const user = await User.findOne({
        where: { id: req.user.id
        },
        attributes: {
            exclude: ['password']
        }
    })
    
    if (!user) return res.status(404).send('User not found.')
    
    res.status(200).json(user)
})

user.post('/', async (req, res) => {
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
    
    if (user) return res.status(400).send('User already registered.')

    
    const hash = await bcrypt.hash(userData.password, 10)
    userData.password = hash;

    user = await User.create(userData)

    const token = user.generateToken(user)

    data = _.pick(userData, ['username', 'email'])

    res.status(200).header('x-auth', token).send({id: user.id, username: data.username, email: userData.email})
})

user.put('/:id', async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!user) return res.status(404).send('User not found.')

    user.username = req.body.username;
    user.fname = req.body.fname;
    user.mname = req.body.mname;
    user.lname = req.body.lname;
    user.cname = req.body.cname;
    user.role = req.body.role;
    user.email = req.body.email;
    user.password = req.body.password;
    user.img = req.body.img;
    user.identity_number = req.body.identity_number;
    user.address = req.body.address;
    user.status = req.body.status;

    user.save()

    res.status(200).send(user)
})

module.exports = user;