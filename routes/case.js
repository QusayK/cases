const express = require("express");
const Case = require("../models/Case");
const auth = require("../middlewares/auth");
const managerAuth = require("../middlewares/managerAuth");
const caseAuth = require("../middlewares/caseAuth");
const { validateId, validateCase } = require("../middlewares/validation");
const _ = require("lodash");

const _case = express.Router();

_case.use(auth);

_case.get("/", async (req, res) => {
  const _case = await Case.findAll({
    where: {
      who_added_it: req.user.id,
    },
  });

  if (!_case) return res.status(404).send("Case not found.");

  res.status(200).json(_case);
});

_case.get("/all", managerAuth, async (req, res) => {
  const _case = await Case.findAll({
    where: {
      manager_id: req.user.id,
    },
  });

  if (!_case) return res.status(404).send("No cases found.");

  res.status(200).json(_case);
});

_case.post("/", validateCase, async (req, res) => {
  const { id, manager_id, role } = req.user;
  let manager;

  if (role === 1) manager = id;
  else manager = manager_id;

  const caseData = { ...req.body, who_added_it: id, manager_id: manager };

  const _case = await Case.create(caseData);

  res
    .status(201)
    .json(
      _.pick(_case, [
        "add_adv",
        "edit_adv",
        "desc",
        "cost",
        "cost_type",
        "value",
        "currency",
        "who_added_it",
        "manager_id",
        "createdAt",
        "updatedAt",
      ])
    );
});

_case.put("/:id", [validateId, caseAuth, validateCase], async (req, res) => {
  const _case = req._case;

  _case.adv_id = req.body.adv_id;
  _case.case_type = req.body.case_type;
  _case.desc = req.body.desc;
  _case.cost = req.body.cost;
  _case.cost_type = req.body.cost_type;
  _case.value = req.body.value;
  _case.currency = req.body.currency;
  _case.save();

  res.status(200).json(_case);
});

_case.delete("/:id", [managerAuth, validateId], async (req, res) => {
  const _case = await Case.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!_case) return res.status(404).send("Case not found.");

  res.status(200).send("Case deleted.");
});

_case.get("/:id", [caseAuth, validateId], (req, res) => {
  res.status(200).json(req._case);
});

module.exports = _case;
