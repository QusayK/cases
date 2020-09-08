const express = require("express");
const Attachment = require("../models/Attachment");
const auth = require("../middlewares/auth");
const attachmentAuth = require("../middlewares/attachmentAuth");
const {
  validateId,
  validateAttachment,
  validateAttachParams,
} = require("../middlewares/validation");
const _ = require("lodash");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const uploadFile = require("../middlewares/uploadFile");
const upload = uploadFile("attachment");

const attachment = express.Router();

attachment.use(auth);

attachment.post(
  "/",
  [attachmentAuth, validateAttachment, upload.single("attachment")],
  async (req, res) => {
    const { id, role, manager_id } = req.user;
    const manager = role === 1 ? id : manager_id;

    let path;

    !req.file
      ? res.status(400).send("Please select an attachment.")
      : (path = req.file.path);

    let attachment = {
      ...req.body,
      attachment: path,
      who_added_it: id,
      manager_id: manager,
    };

    attachment = await Attachment.create(attachment);

    res
      .status(201)
      .json(
        _.pick(attachment, [
          "attachment",
          "who_added_it",
          "case_id",
          "manager_id",
          "createdAt",
          "updatedAt",
        ])
      );
  }
);

attachment.put(
  "/:id",
  [validateId, attachmentAuth, validateAttachment, upload.single("attachment")],
  async (req, res) => {
    let attachment = await Attachment.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!attachment) return res.status(404).send("Attachment not found.");

    if (req.file) {
      await unlinkAsync(attachment.attachment);
      attachment.attachment = req.file.path;
    }
    attachment.save();

    res.status(200).json(attachment);
  }
);

attachment.delete(
  "/:id/:case_id",
  [validateAttachParams, attachmentAuth],
  async (req, res) => {
    const attachment = await Attachment.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!attachment) return res.status(404).send("Attachment not found.");

    await unlinkAsync(attachment.attachment);

    await Attachment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Attachment deleted.");
  }
);

attachment.get("/:id", [validateId, attachmentAuth], async (req, res) => {
  const attachments = await Attachment.findAll({
    where: {
      case_id: req.params.id,
    },
  });

  if (attachments.length === 0)
    res.status(404).send("No attachments to show for this case.");

  res.status(200).json(attachments);
});

module.exports = attachment;
