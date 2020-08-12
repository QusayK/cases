const express = require("express");
const User = require("../models/User");
const Adv = require("../models/Adv");
const AdvPermissions = require("../models/AdvPermissions");
const auth = require("../middlewares/auth");
const managerAuth = require("../middlewares/managerAuth");
const adminAddAdv_perm = require("../middlewares/adminAddAdv_perm");
const advAuth = require("../middlewares/advAuth");
const { validateId, validateUser } = require("../middlewares/validation");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const adv = express.Router();

adv.use(auth);

const role = 3;

adv.get("/", managerAuth, async (req, res) => {
  const adv = await Adv.findAll({
    where: {
      manager_id: req.user.id,
    },
  });

  if (_.isEmpty(adv)) return res.status(404).send("No lawyers found.");

  res.status(200).json(adv);
});

adv.get("/me", async (req, res) => {
  if (req.user.role != 3) return res.status(403).send("Access forbidden.");

  const adv = await User.findOne({
    where: {
      id: req.user.id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!adv) return res.status(404).send("Lawyer not found.");

  res.status(200).json(adv);
});

adv.post("/", [adminAddAdv_perm, validateUser], async (req, res) => {
  let manager_id;
  const company = req.user.company;

  if (req.user.role == 1) manager_id = req.user.id;
  else if (req.user.role == 2) manager_id = req.user.manager_id;

  let advData = { ...req.body, role, company_name: company };
  advData = _.pick(advData, [
    "id",
    "username",
    "first_name",
    "last_name",
    "company_name",
    "role",
    "email",
    "password",
    "img",
    "identity_number",
    "address",
  ]);

  let adv = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (adv) return res.status(400).send("Lawyer already registered.");

  const hash = await bcrypt.hash(advData.password, 10);
  advData.password = hash;

  adv = await User.create(advData);
  await Adv.create({
    id: adv.id,
    manager_id,
  });

  let perms = { ...req.body.permissions, id: adv.id };
  perms = await AdvPermissions.create(perms);

  const permissions = _.pick(perms, ["edit_case"]);

  const token = adv.generateToken(adv, manager_id, permissions, company);

  res
    .status(201)
    .header("x-auth", token)
    .json(_.pick(adv, ["id", "username", "email", "role"]));
});

adv.put("/:id", [advAuth, validateId, validateUser], async (req, res) => {
  let adv = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!adv) return res.status(404).send("Lawyer not found.");

  adv.username = req.body.username;
  adv.first_name = req.body.first_name;
  adv.last_name = req.body.last_name;
  adv.company_name = req.body.company_name;
  adv.email = req.body.email;
  adv.password = await bcrypt.hash(req.body.password, 10);
  adv.img = req.body.img;
  adv.identity_number = req.body.identity_number;
  adv.address = req.body.address;
  adv.status = req.body.status;
  adv.save();

  res.status(200).json(_.pick(adv, ["id", "username", "role"]));
});

adv.delete("/:id", [advAuth, validateId], async (req, res) => {
  const adv = await User.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!adv) return res.status(404).send("Lawyer not found.");

  res.status(200).send("Lawyer deleted.");
});

adv.get("/:id", [advAuth, validateId], async (req, res) => {
  const adv = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!adv) return res.status(404).send("Lawyer not found.");

  res.status(200).json(adv);
});

module.exports = adv;
