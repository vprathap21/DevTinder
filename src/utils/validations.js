const validator = require("validator");

const validateSiginUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("emal is not vlaid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};
module.exports = validateSiginUpData;
