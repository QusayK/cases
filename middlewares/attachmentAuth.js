const Case = require("../models/Case");
const Case_admin = require("../models/Case_admin");
const Case_advocate = require("../models/Case_advocate");

module.exports = async (req, res, next) => {
  const { id, role } = req.user;
  const case_id = req.body.case_id || req.params.case_id || req.params.id;

  if (role === 1) {
    const _case = await Case.findOne({
      where: {
        id: case_id,
      },
    });

    if (!_case) return res.status(404).send("Case not found.");

    if (_case.manager_id === id) return next();
  } else if (role === 2) {
    const admin = await Case_admin.findOne({
      where: {
        case_id: case_id,
      },
    });

    if (!admin) return res.status(403).send("Access forbidden.");

    return next();
  } else if (role === 3) {
    const adv = await Case_advocate.findOne({
      where: {
        case_id: case_id,
      },
    });

    if (!adv) return res.status(403).send("Access forbidden.");

    return next();
  }

  res.status(403).send("Access forbidden.");
};
