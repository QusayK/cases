const Joi = require('joi')

validateId = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required()
    })

    const { error } = schema.validate(req.params)
    if (error) return res.status(400).send(error.details[0].message)

    next()
}

validateUser = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(60).required(),
        fname: Joi.string().min(3).max(50).required(),
        mname: Joi.string().min(3).max(50).required(),
        lname: Joi.string().min(3).max(50).required(),
        cname: Joi.string().min(3).max(50).required(),
        role: Joi.number().required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(6).max(1028).required(),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        img: Joi.string().max(255),
        identity_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        address: Joi.string().min(5).max(100).required(),
        status: Joi.number()
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    next()
}

exports.validateId = validateId
exports.validateUser = validateUser