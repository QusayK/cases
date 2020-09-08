const express = require("express");
const Case_admin = require("../models/Case_admin");
const auth = require("../middlewares/auth");
const caseAdminAuth = require("../middlewares/caseAdminAuth");
const { validateId, validateCaseAdmin } = require("../middlewares/validation");

const caseAdmin = express.Router();

caseAdmin.use(auth);

caseAdmin.post("/", [caseAdminAuth, validateCaseAdmin], async (req, res) => {
  let admin = await Case_admin.findOne({
    where: {
      admin_id: req.body.admin_id,
    },
  });

  if (admin)
    return res.status(400).send("Admin already in chrage on this case.");

  admin = await Case_admin.create(req.body);

  res.status(201).json(admin);
});

caseAdmin.delete("/:id", [validateId, caseAdminAuth], async (req, res) => {
  const admin = await Case_admin.destroy({
    where: {
      admin_id: req.params.id,
    },
  });

  if (!admin) return res.status(404).send("Admin not found.");

  res.status(200).send("Admin removed from this case.");
});

caseAdmin.get("/:id", [validateId, caseAdminAuth], async (req, res) => {
  const admin = await Case_admin.findAll({
    where: {
      case_id: req.params.id,
    },
  });

  if (admin.length === 0)
    return res.status(404).send("No admins found for this case.");

  res.status(200).json(admin);
});

module.exports = caseAdmin;
