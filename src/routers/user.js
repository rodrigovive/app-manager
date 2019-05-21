const User = require("../models/User");
const express = require("express");
const multer = require("multer");
const router = new express.Router();
const auth = require("../middleware/auth");
const sharp = require("sharp");
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

router.patch("/users/me", auth, async (req, res) => {
  const { user, body } = req;
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

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload an image with format jpg, jpeg or png.")
      );
    }
    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250
      })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  const { user } = req;
  try {
    user.avatar = undefined;
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id);
    if (!user || !user.avatar) {
      throw new Error("Error user avatar not found");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send({
      error: e.toString()
    });
  }
});
module.exports = router;
