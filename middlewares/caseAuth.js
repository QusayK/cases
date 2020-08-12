const Case = require("../models/Case");

module.exports = async (req, res, next) => {
  const { id, manager_id, role } = req.user;
  const perm = req.user.permissions;

  const _case = await Case.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!_case) return res.status(404).send("Case not found.");
  req._case = _case;

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
