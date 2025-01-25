const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://211501064:1mmGcmQkOOYOb8Fs@cluster0.9aeit.mongodb.net/"
  );
};
module.exports = connectDb;
