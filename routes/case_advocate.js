const express = require("express");
const Case_advocate = require("../models/Case_advocate");
const auth = require("../middlewares/auth");
const caseAdvAuth = require("../middlewares/caseAdvAuth");
const { validateId, validateCaseAdv } = require("../middlewares/validation");

const caseAdv = express.Router();

caseAdv.use(auth);

caseAdv.post("/", [caseAdvAuth, validateCaseAdv], async (req, res) => {
  let adv = await Case_advocate.findOne({
    where: {
      adv_id: req.body.adv_id,
    },
  });

  if (adv)
    return res
      .status(400)
      .send("The case has already been assigned to this lawyer.");

  adv = await Case_advocate.create(req.body);

  res.status(201).json(adv);
});

caseAdv.delete("/:id", [validateId, caseAdvAuth], async (req, res) => {
  const adv = await Case_advocate.destroy({
    where: {
      adv_id: req.params.id,
    },
  });

  if (!adv) return res.status(404).send("Lawyer not found.");

  res.status(200).send("Lawyer removed from this case.");
});

caseAdv.get("/:id", [validateId, caseAdvAuth], async (req, res) => {
  const adv = await Case_advocate.findAll({
    where: {
      case_id: req.params.id,
    },
  });

  if (adv.length === 0) return res.status(404).send("No lawyers found.");

  res.status(200).json(adv);
});

module.exports = caseAdv;
