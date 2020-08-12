const express = require("express");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const managerAuth_specific = require("../middlewares/managerAuth_specific");
const { validateId, validateUser } = require("../middlewares/validation");
const cors = require("cors");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const manager = express.Router();

manager.use(cors());

const role = 1;

manager.get("/me", auth, async (req, res) => {
  if (req.user.role != 1) return res.status(403).send("Access forbidden.");

  const manager = await User.findOne({
    where: { id: req.user.id },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!manager) return res.status(404).send("Manager not found.");

  res.status(200).json(manager);
});

manager.post("/", validateUser, async (req, res) => {
  const managerData = { ...req.body, role };

  let manager = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (manager) return res.status(400).send("Manager already registered.");

  const hash = await bcrypt.hash(managerData.password, 10);
  managerData.password = hash;

  manager = await User.create(managerData);

  const manager_id = "SELF";
  const permissions = "ALL";

  const token = manager.generateToken(manager, permissions, manager_id);

  res
    .status(201)
    .header("x-auth", token)
    .json(_.pick(manager, ["id", "username", "email", "role"]));
});

manager.put(
  "/:id",
  [auth, managerAuth_specific, validateId, validateUser],
  async (req, res) => {
    let manager = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!manager) return res.status(404).send("Manager not found.");

    manager.username = req.body.username;
    manager.first_name = req.body.first_name;
    manager.last_name = req.body.last_name;
    manager.company_name = req.body.company_name;
    manager.email = req.body.email;
    manager.password = await bcrypt.hash(req.body.password, 10);
    manager.img = req.body.img;
    manager.identity_number = req.body.identity_number;
    manager.address = req.body.address;
    manager.status = req.body.status;
    manager.save();

    res.status(200).json(_.pick(manager, ["id", "username", "role"]));
  }
);

manager.delete(
  "/:id",
  [auth, managerAuth_specific, validateId],
  async (req, res) => {
    const manager = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!manager) return res.status(404).send("Manager not found.");

    res.status(200).send("Manager deleted.");
  }
);

manager.get(
  "/:id",
  [auth, managerAuth_specific, validateId],
  async (req, res) => {
    const manager = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!manager) return res.status(404).send("Manager not found.");

    res.status(200).json(manager);
  }
);

module.exports = manager;
