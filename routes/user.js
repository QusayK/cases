const express = require('express')
const user = express.Router()
const auth = require('../middlewares/auth')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Phone = require('../models/Phone')
const { validateId, validateUser } = require('../middlewares/validation')
const _ = require('lodash')
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

user.post('/', validateUser, async (req, res) => {
    const userData = _.pick(req.body, [
        'username',
        'fname',
        'mname',
        'lname',
        'cname',
        'role',
        'email',
        'password',
        'img',
        'identity_number',
        'address',
        'status'
    ])

    let user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    
    if (user) return res.status(400).send('User already registered.')
    
    const hash = await bcrypt.hash(userData.password, 10)
    userData.password = hash;

    user = await User.create(userData)

    Phone.create({
        id: user.id,
        phone_number: req.body.phone_number
    })

    const token = user.generateToken(user)

    res.status(200).header('x-auth', token).send({id: user.id, username: userData.username, email: userData.email})
})

user.put('/:id', [validateId, validateUser, auth], async (req, res) => {
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

user.delete('/:id', [validateId, auth], async (req, res) => {
    const user = await User.destroy({
        where: {
            id: req.params.id
        }
    })

    if (!user) return res.status(404).send('User not found.')

    Phone.destroy({
        where: {
            id: req.params.id
        }
    })

    res.status(200).send('User deleted.')
})

user.get('/:id', [validateId, auth], async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['password']
        }
    })

    if (!user) return res.status(404).send('User not found.')

    res.status(200).send(user)
})

module.exports = user;