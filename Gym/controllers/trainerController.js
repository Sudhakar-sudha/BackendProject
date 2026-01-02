import Trainer from "../models/Trainer.js";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

export const addTrainer = async (req, res) => {
  const trainer = await Trainer.create({
    ...req.body,
    image: req.file?.path,
  });

  res.json(trainer);
};

export const getTrainers = async (req, res) => {
  res.json(await Trainer.find());
};

export const getTrainerById = async (req, res) => {
  res.json(await Trainer.findById(req.params.id));
};

export const toggleActive = async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  trainer.active = !trainer.active;
  await trainer.save();
  res.json(trainer);
};

export const updateTrainer = async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);

  if (req.file && trainer.image) {
    fs.unlink(path.join(uploadDir, trainer.image), () => {});
  }

  Object.assign(trainer, req.body);
  if (req.file) trainer.image = req.file.path;

  await trainer.save();
  res.json(trainer);
};

export const deleteTrainerPermanent = async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);

  if (trainer.image) {
    fs.unlink(path.join(uploadDir, trainer.image), () => {});
  }

  await trainer.deleteOne();
  res.json({ message: "Trainer deleted" });
};
