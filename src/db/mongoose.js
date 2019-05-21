const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-api";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
