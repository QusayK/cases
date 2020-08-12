module.exports = (req, res, next) => {
    if (role === req.user.role && req.params.id === req.user.id)
        return next()

    res.status(403).send('Access forbidden.')
}