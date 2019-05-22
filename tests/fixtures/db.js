const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/User");
const Task = require("../../src/models/Task");
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "user test",
  password: "userpasswod",
  email: "user@test.com",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.SECRET_JWT)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "two user",
  password: "twopassss",
  email: "user2@test.com",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.SECRET_JWT)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "one task",
  completed: true,
  owner: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "two task",
  completed: false,
  owner: userOneId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "third task",
  completed: true,
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree
};
