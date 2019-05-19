require("../db/mongoose");

const Task = require("../models/Task");
const _id = "5cdd677cbb302a0e54a900d9";
// Task.findByIdAndRemove(_id)
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(tasks => {
//     console.log(tasks);
//   })
//   .catch(err => {
//     console.log("Error   ", err);
//   });

const deleteTaskAndCount = async id => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount(_id)
  .then(count => {
    console.log(count);
  })
  .catch(e => {
    console.log("e ", e);
  });
