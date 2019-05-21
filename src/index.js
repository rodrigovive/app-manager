const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), "src/config/dev.env")
});

require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.get('/',(req,res) => {
  res.send({
    info: 'APP MANAGER'
  })
})

app.listen(PORT, () => {
  console.log("Server is up on port ", PORT);
});
 