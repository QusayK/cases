const User = require("../models/User");
const Admin = require("../models/Admin");
const Adv = require("../models/Adv");

module.exports = async (req, res, next) => {
  const { id, role } = req.user;
  const requested_id = req.params.id || req.body[0].id;
  let requested_role;

  if (req.method == "POST" || req.method == "PUT")
    requested_role = req.body[0].role;
  else requested_role = req.params.role;

  if (role == 1) {
    if (requested_role == 1) {
      const manager = await User.findOne({
        where: {
          id: requested_id,
        },
      });

      if (!manager) return res.status(404).send("Manager not found.");

      if (manager.id == id) return next();
    } else if (requested_role == 2) {
      const admin = await Admin.findOne({
        where: {
          id: requested_id,
        },
      });

      if (!admin) return res.status(404).send("Admin not found.");

      if (admin.manager_id == id) return next();
    } else if (requested_role == 3) {
      const adv = await Adv.findOne({
        where: {
          id: requested_id,
        },
      });

      if (!adv) return res.status(404).send("Lawyer not found.");

      if (adv.manager_id == id) return next();
    }
  } else if ((role == 2 || role == 3) && requested_id == id) return next();

  res.status(403).send("Access forbidden.");
};
