const Joi = require("joi");

const validateId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(60).required(),
    first_name: Joi.string().min(3).max(50).required(),
    last_name: Joi.string().min(3).max(50).required(),
    company_name: Joi.string().min(3).max(50),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(1028).required(),
    img: Joi.string().max(255),
    phone_number: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    identity_number: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address: Joi.string().min(5).max(100).required(),
    status: Joi.number(),
    permissions: Joi.object(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateAdminPerm = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number(),
    add_adv: Joi.number(),
    edit_employee: Joi.number(),
    add_case: Joi.number(),
    edit_case: Joi.number(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateAdvPerm = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number(),
    edit_case: Joi.number(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateCase = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number(),
    case_type: Joi.number().required(),
    desc: Joi.string(),
    cost: Joi.number().required(),
    cost_type: Joi.number().required(),
    value: Joi.number().required(),
    currency: Joi.number().required(),
    who_added_it: Joi.number(),
    manager_id: Joi.number(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateCaseAdmin = (req, res, next) => {
  const schema = Joi.object({
    case_id: Joi.number().required(),
    admin_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validateCaseAdv = (req, res, next) => {
  const schema = Joi.object({
    case_id: Joi.number().required(),
    adv_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validatePhoneNumber = (req, res, next) => {
  const schema = Joi.array().items(
    Joi.object({
      id: Joi.number(),
      phone_number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      new_phone_number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/),
      role: Joi.number().required(),
    })
  );

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

const validatePhoneParams = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    role: Joi.number().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) res.status(400).send(error.details[0].message);

  next();
};

const validateAttachment = (req, res, next) => {
  const schema = Joi.object({
    attachment: Joi.string().required(),
    case_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  next();
};

const validateAttachParams = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    case_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) res.status(400).send(error.details[0].message);

  next();
};

const validateNote = (req, res, next) => {
  const schema = Joi.object({
    case_id: Joi.number().required(),
    note: Joi.string().required(),
    attachment: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
};

module.exports = {
  validateId,
  validateUser,
  validateAdminPerm,
  validateAdvPerm,
  validateCase,
  validateCaseAdmin,
  validateCaseAdv,
  validatePhoneNumber,
  validatePhoneParams,
  validateAttachment,
  validateAttachParams,
  validateNote,
};
