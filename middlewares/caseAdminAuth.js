const Case = require("../models/Case");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  const { id, role } = req.user;
  const admin_id = req.params.id || req.body.admin_id;

  if (req.method === "GET") {
    const _case = await Case.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!_case) return res.status(404).send("Case not found.");

    if (role === 1 && _case.manager_id === id) return next();
  } else {
    const admin = await Admin.findOne({
      where: {
        id: admin_id,
      },
      attributes: ["manager_id"],
    });

    if (!admin) return res.status(404).send("Admin not found.");
  }

  if (role === 1 && admin.manager_id === id) return next();

  res.status(403).send("Access forbidden.");
};
