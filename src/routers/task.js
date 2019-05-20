const express = require("express");
const router = new express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const { body = {}, user } = req;

  const task = new Task({ ...body, owner: user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.get("/tasks", auth, async (req, res) => {
  const { user, query } = req;
  const match = {};
  const sort = {};
  if (query.completed) {
    match.completed = query.completed === "true";
  }
  if(query.sortBy){
    const parts = query.sortBy.split('-')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    // const tasks = await Task.find({ owner: user._id });
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(query.limit),
          skip: parseInt(query.skip),
          sort
        }
      })
      .execPopulate();
    res.status(200).send(user.tasks);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const {
    params: { id: _id },
    user
  } = req;

  try {
    const task = await Task.findOne({ _id, owner: user._id });
    if (!task) {
      return res.status(404).send(task);
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const {
    params: { id: _id },
    body,
    user
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
    const task = await Task.findOne({ _id, owner: user._id });

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

router.delete("/tasks/:id", auth, async (req, res) => {
  const {
    params: { id: _id },
    user
  } = req;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: user._id });
    if (!task) {
      return res.status(404).send(task);
    }
    return res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
