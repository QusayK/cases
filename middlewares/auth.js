const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    const token = req.header('x-auth')
    if (!token) return res.status(401).send("Access deniend. No token was provided.")


    try{
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        req.user = payload

        next()
    } catch(err) {
        res.status(400).send('Invalid token.')
    }
}