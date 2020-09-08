const Case = require("../models/Case");
const Case_admin = require("../models/Admin");
const Case_advocate = require("../models/Case_advocate");

module.exports = async (req, res, next) => {
  const { id, manager_id, role } = req.user;
  const perm = req.user.permissions;
  const case_id = req.params.id;

  const _case = await Case.findOne({
    where: {
      id: case_id,
    },
  });

  if (!_case) return res.status(404).send("Case not found.");
  req._case = _case;

  if (role === 2) {
    const admin = await Case_admin.findOne({
      where: {
        case_id,
        admin_id: id,
      },
    });

    if (!admin) return res.status(403).send("Access forbidden.");
  } else if (role === 3) {
    const adv = await Case_advocate.findOne({
      where: {
        case_id,
        adv_id: id,
      },
    });

    if (!adv) return res.status(403).send("Access forbidden.");
  }

  if (role === 1 && id === _case.manager_id) return next();
  else if (
    role === 2 &&
    manager_id === _case.manager_id &&
    perm.add_case &&
    req.method === "POST"
  )
    return next();
  else if (
    role === 2 &&
    manager_id === _case.manager_id &&
    perm.edit_case &&
    req.method === "PUT"
  )
    return next();
  else if (
    role === 3 &&
    manager_id === _case.manager_id &&
    perm.edit_case &&
    req.method === "PUT"
  )
    return next();
  else if (manager_id === _case.manager_id && req.method === "GET")
    return next();

  res.status(403).send("Access forbidden.");
};
