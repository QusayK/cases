const express = require("express");
const Phone = require("../models/Phone");
const auth = require("../middlewares/auth");
const phoneAuth = require("../middlewares/phoneAuth");
const {
  validateId,
  validatePhoneParams,
  validatePhoneNumber,
} = require("../middlewares/validation");
const { Op } = require("sequelize");

phone = express.Router();

phone.use(auth);

phone.post("/", [phoneAuth, validatePhoneNumber], async (req, res) => {
  const id = req.body[0].id;
  const newPhoneNums = req.body.length;

  if (newPhoneNums > 3)
    return res.status(400).send("Maximum three numbers are allowed.");

  const oldPhoneNums = await Phone.count({
    where: {
      id,
    },
  });

  if (oldPhoneNums + newPhoneNums > 3)
    return res.status(400).send("Maximum three numbers are allowed.");

  const phoneNums = req.body.map((element) => element.phone_number);

  let phones = await Phone.findOne({
    where: {
      phone_number: {
        [Op.or]: [...phoneNums],
      },
    },
  });

  if (phones) return res.status(400).send("Phone number already exists.");

  phones = await Phone.bulkCreate(req.body);

  res.status(201).send(phones);
});

phone.put(
  "/:id",
  [validateId, phoneAuth, validatePhoneNumber],
  async (req, res) => {
    let phone = await Phone.findOne({
      where: {
        id: req.params.id,
        phone_number: req.body[0].phone_number,
      },
    });

    if (!phone) return res.status(404).send("Phone number was not found.");

    phone.phone_number = req.body[0].new_phone_number;
    await phone.save();

    res.status(200).json(phone);
  }
);

phone.delete(
  "/:id/:role",
  [validatePhoneParams, phoneAuth, validatePhoneNumber],
  async (req, res) => {
    const phoneNums = req.body.map((element) => element.phone_number);

    const phone = await Phone.destroy({
      where: {
        id: req.params.id,
        phone_number: {
          [Op.and]: [...phoneNums],
        },
      },
    });

    if (!phone) return res.status(404).send("Phone number was not found.");

    res.status(200).send("Phone number deleted.");
  }
);

phone.get("/:id/:role", [validatePhoneParams, phoneAuth], async (req, res) => {
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
