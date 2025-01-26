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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "lasteName",
    "fistName",
    "emailId",
    "photoUrl",
    "about",
    "gender",
    "skills",
    "age",
  ];
  const isAllowed = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k)
  );
  return isAllowed;
};
module.exports = { validateSiginUpData, validateEditProfileData };
