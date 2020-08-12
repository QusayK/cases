const express = require("express");
const Phone = require("../models/Phone");
const auth = require("../middlewares/auth");
const phoneAuth = require("../middlewares/phoneAuth");
const {
  validateId,
  validatePhoneNumber,
} = require("../middlewares/validation");
const _ = require("lodash");
const { Op } = require("sequelize");

phone = express.Router();

phone.use(auth);
phone.use(phoneAuth);

phone.post("/", validatePhoneNumber, async (req, res) => {
  if (req.body.length > 3)
    return res.status(400).send("Maximum three numbers are allowed.");

  const phoneNums = req.body.map((element) => element.phone_number);

  let phones = await Phone.findOne({
    where: {
      phone_number: {
        [Op.or]: [...phoneNums],
      },
    },
  });

  if (phones) return res.status(400).send("Phone number already exist.");

  phones = await Phone.bulkCreate(req.body);

  res.status(201).send(phones);
});

phone.put("/:id", [validateId, validatePhoneNumber], async (req, res) => {
  let phone = await Phone.findOne({
    where: {
      id: req.params.id,
      phone_number: req.body[0].phone_number,
    },
  });

  if (!phone) return res.status(404).send("Phone number was not found.");

  phone.phone_number = req.body[0].new_phone_number;

  res.status(200).json(phone);
});

phone.delete("/:id", [validateId, validatePhoneNumber], async (req, res) => {
  const phoneNums = req.body.map((element) => element.phone_number);

  const phone = await Phone.destroy({
    where: {
      id: req.params.id,
      phone_number: {
        [Op.or]: [...phoneNums],
      },
    },
  });

  if (!phone) return res.status(404).send("Phone number was not found.");

  res.status(200).send("Phone number deleted.");
});

phone.get("/:id", validateId, async (req, res) => {
  const phones = await Phone.findAll({
    where: {
      id: req.params.id,
    },
  });

  if (phones.length === 0)
    return res.status(404).send("Phone number was not found.");

  res.status(200).json(phones);
});

module.exports = phone;
