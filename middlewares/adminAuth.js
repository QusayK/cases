const Admin = require('../models/Admin')

module.exports = async (req, res, next) => {
    const { id, role } = req.user

    const admin = await Admin.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!admin) return res.status(404).send('Admin not found.')

    if (role !== 1 && role !== 2)
        return res.status(403).send('Access forbidden.')
    else if (role === 1 && id === admin.manager_id) 
        return next()
    else if (role === 2 && id === admin.id)
        return next()

    return res.status(403).send('Access forbidden.')
}