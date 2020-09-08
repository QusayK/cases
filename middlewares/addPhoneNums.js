const Phone = require("../models/Phone");

module.exports = async (req, res, user) => {
  const { id, role } = user;
  const phoneNum = req.body.phone_number;

  const oldPhoneNums = await Phone.count({
    where: {
      id,
    },
  });

  if (oldPhoneNums + 1 > 3)
    return res.status(400).send("Maximum three numbers are allowed.");

  let phone = await Phone.findOne({
    where: {
      phone_number: phoneNum,
    },
  });

  if (phone) return res.status(400).send("Phone number already exists.");

  await Phone.create({ id, phone_number: phoneNum, role });
};
