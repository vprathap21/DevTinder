const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // console.log(req);
    const user = req.user;
    if (!user) {
      throw new Error("User does not exsist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("invalid token: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const logedinUser = req.user;

    Object.keys(req.body).forEach((key) => (logedinUser[key] = req.body[key]));
    await logedinUser.save();
    res.json({
      message: `${logedinUser.firstName} your profie updated successfullly`,
      data: logedinUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = {
  profileRouter,
};
