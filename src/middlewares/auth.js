const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token form the reques cookies
  // validate the token
  //find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not vlaid");
    }
    const decoded = await jwt.verify(token, "prathap");
    const { _id } = decoded;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
