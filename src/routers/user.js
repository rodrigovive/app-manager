const User = require("../models/User");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
router.post("/users", async (req, res) => {
  const { body = {} } = req;
  const user = new User(body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.post("/users/login", async (req, res) => {
  const {
    body: { email, password }
  } = req;
  try {
    const user = await User.findByCredentials({ email, password });
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  const { user } = req;
  try {
    user.tokens = [];
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.post("/users/logout", auth, async (req, res) => {
  const { user, token } = req;
  try {
    user.tokens = user.tokens.filter(
      tokenObject => tokenObject.token !== token
    );
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

router.get("/users/me", auth, (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/users/me", auth ,async (req, res) => {
  const {
    user,
    body
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
    updates.forEach(update => (user[update] = body[update]));
    await user.save();
    return res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const { user } = req;
  try {
    await user.remove();
    return res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
