module.exports = (req, res, next) => {
    const { id, role } = req.user
    const requested_id = req.params.id || req.body.id

    if (role === 1)
        return next()
    else if (id === requested_id)
        return next()

    res.status(403).send('Access forbidden.')
}