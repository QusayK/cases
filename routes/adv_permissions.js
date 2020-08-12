const express = require("express");
const AdvPermissions = require("../models/AdvPermissions");
const Adv = require("../models/Adv");
const auth = require("../middlewares/auth");
const managerAuth = require("../middlewares/managerAuth");
const { validateId, validateAdvPerm } = require("../middlewares/validation");

const advPerm = express.Router();

advPerm.use(auth);
advPerm.use(managerAuth);

advPerm.get("/:id", validateId, async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  const permissions = await AdvPermissions.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(400).send("Lawyer have no permissions set.");

  res.status(200).json(permissions);
});

advPerm.post("/", validateAdvPerm, async (req, res) => {
  const permData = { ...req.body };

  let permissions = await AdvPermissions.findOne({
    where: {
      id: req.body.id,
    },
  });

  if (permissions)
    return res.status(400).send("Lawyer permissions already set.");

  permissions = await AdvPermissions.create(permData);

  res.status(201).json(permissions);
});

advPerm.put("/:id", [validateId, validateAdvPerm], async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  const permissions = await AdvPermissions.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(404).send("Lawyer have no permissions set.");

  permissions.edit_case = req.body.edit_case;
  permissions.save();

  res.status(200).json(permissions);
});

advPerm.delete("/:id", validateId, async (req, res) => {
  if (!managerAuth_specific(req))
    return res.status(403).send("Access forbidden.");

  const permissions = await AdvPermissions.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!permissions)
    return res.status(200).send("Lawyer have no permissions set.");

  res.status(200).send("Permissions deleted.");
});

const managerAuth_specific = async (req) => {
  const adv = await Adv.findOne({
    where: {
      id: req.params.id,
    },
  });

  return req.user.id === adv.manager_id;
};

module.exports = advPerm;
