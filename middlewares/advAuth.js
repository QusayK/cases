const Adv = require('../models/Adv')

module.exports = async (req, res, next) => {
    const { id, manager_id, role } = req.user
    const { addAdv_perm, editAdv_perm } = req.user.permissions

    const adv = await Adv.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!adv) return res.status(404).send('Lawyer not found.')
    
    if (role === 1 && id === adv.manager_id) 
        return next()
    else if (role === 2 && manager_id === adv.manager_id && req.method === "POST" && addAdv_perm)
        return next()
    else if (role === 2 && manager_id === adv.manager_id && req.method === "PUT" && editAdv_perm)
        return next()
    else if (role === 3 && id === adv.id)
        return next()

    return res.status(403).send('Access forbidden.')
}