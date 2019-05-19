const User = require("../models/User");
const express = require("express");
const router = new express.Router();
router.post("/users", async (req, res) => {
  const { body = {} } = req;
  const user = new User(body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.patch("/users/:id", async (req, res) => {
  const {
    body,
    params: { id: _id }
  } = req;
  const updates = Object.keys(body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(500).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send(user);
    }

    updates.forEach(update => (user[update] = body[update]));
    await user.save();
    return res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const {
    body: { email, password }
  } = req;
  try {
    const user = await User.findByCredentials({ email, password });
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e.toString());  
  }
});
module.exports = router;
