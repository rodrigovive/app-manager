const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("./db/mongoose");
const User = require("./models/User");
const Task = require("./models/Task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("Server is up on port ", PORT);
});
