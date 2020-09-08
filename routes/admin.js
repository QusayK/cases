const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const AdminPermissions = require("../models/AdminPermissions");
const auth = require("../middlewares/auth");
const managerAuth = require("../middlewares/managerAuth");
const adminAuth = require("../middlewares/adminAuth");
const { validateId, validateUser } = require("../middlewares/validation");
const addPhoneNums = require("../middlewares/addPhoneNums");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const uploadFile = require("../middlewares/uploadFile");
const upload = uploadFile("img");

const admin = express.Router();

admin.use(auth);

const role = 2;
const default_img = "assets/images/default-img.jpg";

admin.get("/", managerAuth, async (req, res) => {
  const admin = await Admin.findAll({
    where: {
      manager_id: req.user.id,
    },
  });

  if (_.isEmpty(admin)) return res.status(404).send("No admins found.");

  res.status(200).json(admin);
});

admin.get("/me", async (req, res) => {
  if (req.user.role != 2) return res.status(403).send("Access forbidden.");

  const admin = await Admin.findOne({
    where: {
      id: req.user.id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!admin) return res.status(404).send("Admin not found.");

  res.status(200).json(admin);
});

admin.post(
  "/",
  [managerAuth, validateUser, upload.single("img")],
  async (req, res) => {
    const company = req.user.company;
    let img;

    if (req.file) img = req.file.path;
    else img = default_img;

    let adminData = { ...req.body, role, company_name: company, img };
    adminData = _.pick(adminData, [
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

    let admin = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (admin) return res.status(400).send("Admin already registered.");

    const hash = await bcrypt.hash(adminData.password, 10);
    adminData.password = hash;

    admin = await User.create(adminData);
    await Admin.create({
      id: admin.id,
      manager_id: req.user.id,
    });

    await addPhoneNums(req, res, admin);

    let perms = { ...req.body.permissions, id: admin.id };
    perms = await AdminPermissions.create(perms);

    const manager_id = req.user.id;
    const permissions = _.pick(perms, [
      "add_adv",
      "edit_adv",
      "add_case",
      "edit_case",
    ]);

    const token = admin.generateToken(admin, permissions, manager_id, company);

    res
      .status(201)
      .header("x-auth", token)
      .json(_.pick(admin, ["id", "username", "email", "role"]));
  }
);

admin.put(
  "/:id",
  [adminAuth, validateId, validateUser, upload.single("img")],
  async (req, res) => {
    let admin = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!admin) return res.status(404).send("Admin not found.");

    admin.username = req.body.username;
    admin.first_name = req.body.first_name;
    admin.last_name = req.body.last_name;
    admin.company_name = req.body.company_name;
    admin.email = req.body.email;
    admin.password = await bcrypt.hash(req.body.password, 10);
    if (req.file) {
      if (admin.img !== default_img) {
        await unlinkAsync(admin.img);
        admin.img = req.file.path;
      } else admin.img = req.file.path;
    }
    admin.identity_number = req.body.identity_number;
    admin.address = req.body.address;
    admin.status = req.body.status;
    admin.save();

    res.status(200).json(_.pick(admin, ["id", "username", "role"]));
  }
);

admin.delete("/:id", [adminAuth, validateId], async (req, res) => {
  const admin = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!admin) return res.status(404).send("Admin not found.");

  if (admin.img !== default_img) await unlinkAsync(admin.img);

  await User.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).send("Admin deleted.");
});

admin.get("/:id", [adminAuth, validateId], async (req, res) => {
  const admin = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (!admin) return res.status(404).send("Admin not found.");

  res.status(200).json(admin);
});

module.exports = admin;
