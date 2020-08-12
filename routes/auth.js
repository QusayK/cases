const express = require("express");
const auth = express.Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const Adv = require("../models/Adv");
const AdminPermissions = require("../models/AdminPermissions");
const AdvPermissions = require("../models/AdvPermissions");
const bcrypt = require("bcrypt");
const _ = require("lodash");

auth.post("/", async (req, res) => {
  let manager_id, permissions, company;

  const userData = _.pick(req.body, "username", "password");

  const user = await User.findOne({
    where: {
      username: userData.username,
    },
  });

  if (!user) return res.status(400).send("Invalid username or password.");

  const validPass = await bcrypt.compare(userData.password, user.password);
  if (!validPass) return res.status(400).send("Invalid username or password.");

  if (user.role == 1) {
    manager_id = "SELF";
    permissions = "ALL";
  } else if (user.role == 2) {
    const admin = await Admin.findOne({
      where: {
        id: user.id,
      },
    });
    manager_id = admin.manager_id;

    const adminPerm = await AdminPermissions.findOne({
      where: {
        id: admin.id,
      },
    });
    permissions = _.pick(adminPerm, [
      "add_adv",
      "edit_adv",
      "add_case",
      "edit_case",
    ]);
  } else if (user.role == 3) {
    const adv = await Adv.findOne({
      where: {
        id: user.id,
      },
    });
    manager_id = adv.manager_id;

    const advPerm = await AdvPermissions.findOne({
      where: {
        id: adv.id,
      },
    });

    permissions = { edit_case: advPerm.edit_case };
  }

  company = user.company_name;

  const token = user.generateToken(user, permissions, manager_id, company);

  res
    .status(200)
    .header("x-auth", token)
    .send(_.pick(user, ["id", "username", "email", "role"]));
});

module.exports = auth;
