const express = require("express");
const { validateSiginUpData } = require("../utils/validations");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSiginUpData(req);
    // encrypt the password
    const { firstName, lastName, emailId, password, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instence of the User model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
    });

    await user.save();
    res.send("user data is saved in db succeessfully ");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credential");
    }
    const ispasswordValid = await user.validatePassword(password);
    if (ispasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfully");
    } else {
      throw new Error("invalid credential");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.get("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logout successfully");
});

module.exports = {
  authRouter,
};
