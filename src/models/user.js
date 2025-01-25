const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
});

const userModel = mongoose.model("User", userSchema);

console.log(userModel);
module.exports = userModel;
