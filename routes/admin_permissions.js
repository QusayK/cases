const express = require("express");
const AdminPermissions = require("../models/AdminPermissions");
const Admin = require("../models/Admin");
const auth = require("../middlewares/auth");
const managerAuth = require("../middlewares/managerAuth");
const { validateId, validateAdminPerm } = require("../middlewares/validation");

const adminPerm = express.Router();

adminPerm.use(auth);
adminPerm.use(managerAuth);

adminPerm.get("/:id", validateId, async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  const permissions = await AdminPermissions.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(404).send("Admin have no permissions set.");

  res.status(200).json(permissions);
});

adminPerm.post("/", validateAdminPerm, async (req, res) => {
  const permData = { ...req.body };

  let permissions = await AdminPermissions.findOne({
    where: {
      id: req.body.id,
    },
  });

  if (permissions)
    return res.status(400).send("Admin permissions already set.");

  permissions = await AdminPermissions.create(permData);

  res.status(201).json(permissions);
});

adminPerm.put("/:id", [validateId, validateAdminPerm], async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  let permissions = await AdminPermissions.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(404).send("Admin have no permissions set.");

  permissions.add_adv = req.body.add_adv;
  permissions.edit_adv = req.body.edit_adv;
  permissions.add_case = req.body.add_case;
  permissions.edit_case = req.body.edit_case;
  permissions.save();

  res.status(200).json(permissions);
});

adminPerm.delete("/:id", validateId, async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  const permissions = await AdminPermissions.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(404).send("Admin have no permissions set.");

  res.status(200).send("Permissions deleted.");
});

const managerAuth_specific = async (req) => {
  const admin = await Admin.findOne({
    where: {
      id: req.params.id,
    },
  });

  return req.user.id === admin.manager_id;
};

module.exports = adminPerm;
