const express = require("express");
const router = new express.Router();
const Task = require("../models/Task");

router.post("/tasks", async (req, res) => {
  const { body = {} } = req;

  const task = new Task(body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.get("/tasks/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send(task);
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const {
    params: { id: _id },
    body
  } = req;

  const updates = Object.keys(body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid fields"
    });
  }

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => (task[update] = body[update]));
    await task.save();
    return res.status(200).send(task);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send(task);
    }
    return res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
