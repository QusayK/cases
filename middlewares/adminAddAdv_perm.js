const AdminPermissions = require('../models/AdminPermissions')

module.exports = async (req, res, next) => {
    const { role, permissions } = req.user

    if (role === 2 && !permissions.add_adv)
        return res.status(403).send('Access forbidden.')
    else if (role !== 1) 
        return res.status(403).send('Access forbidden.')

    next()
}