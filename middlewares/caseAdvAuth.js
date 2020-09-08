const Case = require("../models/Case");
const Adv = require("../models/Adv");

module.exports = async (req, res, next) => {
  const { id, manager_id, role } = req.user;
  const perms = req.user.permissions;
  const adv_id = req.params.id || req.body.adv_id;

  if (req.method === "GET") {
    const _case = await Case.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!_case) return res.status(404).send("Case not found.");

    if (role === 1 && _case.manager_id === id) return next();
    else if (role === 2 && _case.manager_id === manager_id && perms.add_adv)
      return next();
  } else {
    const adv = await Adv.findOne({
      where: {
        id: adv_id,
      },
      attributes: ["manager_id"],
    });

    if (!adv) return res.status(404).send("Lawyer not found.");
    console.log(adv.manager_id);
    if (role === 1 && adv.manager_id === id) return next();
    else if (role === 2 && adv.manager_id === manager_id && perms.add_adv)
      return next();
  }

  res.status(403).send("Access forbidden.");
};
