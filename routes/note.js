const express = require("express");
const Note = require("../models/Note");
const auth = require("../middlewares/auth");
const attachmentAuth = require("../middlewares/attachmentAuth");
const {
  validateId,
  validateAttachParams,
  validateNote,
} = require("../middlewares/validation");
const _ = require("lodash");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const uploadFile = require("../middlewares/uploadFile");
const upload = uploadFile("attachment");

const note = express.Router();

note.use(auth);

note.post(
  "/",
  [attachmentAuth, validateNote, upload.single("attachment")],
  async (req, res) => {
    let path;

    if (req.file) path = req.file.path;

    const { id, manager_id, role } = req.user;
    const manager = role === 1 ? id : manager_id;

    let note = {
      ...req.body,
      attachment: path,
      who_added_it: id,
      manager_id: manager,
    };

    note = await Note.create(note);

    res
      .status(200)
      .json(
        _.pick(note, [
          "case_id",
          "note",
          "attachment",
          "who_added_it",
          "manager_id",
          "createdAt",
          "updatedAt",
        ])
      );
  }
);

note.put(
  "/:id",
  [validateId, attachmentAuth, validateNote, upload.single("attachment")],
  async (req, res) => {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!note) return res.status(404).send("Note not found.");

    note.note = req.body.note;
    if (req.file) {
      await unlinkAsync(note.attachment);
      note.attachment = req.file.path;
    }
    note.save();

    res.status(200).json(note);
  }
);

note.delete(
  "/:id/:case_id",
  [validateAttachParams, attachmentAuth],
  async (req, res) => {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!note) return res.status(404).send("Note not found.");

    await unlinkAsync(note.attachment);

    await Note.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Note deleted.");
  }
);

note.get("/:id", [validateId, attachmentAuth], async (req, res) => {
  const notes = await Note.findAll({
    where: {
      case_id: req.params.id,
    },
  });

  if (notes.length === 0)
    return res.status(404).send("No notes to show for this case.");

  res.status(200).json(notes);
});

module.exports = note;
