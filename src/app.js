const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validateSiginUpData = require("./utils/validations");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSiginUpData(req);
    // encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instence of the User model
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user data is saved in db succeessfully ");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credential");
    }
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (ispasswordValid) {
      res.send("Login successfully");
    } else {
      throw new Error("invalid credential");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  const reponce = Schema.safeParse(userEmail);
  console.log(reponce);
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOneAndDelete(userId);
    res.send("user deleted successfuly");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;
  console.log(data);

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log(isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong:" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log(`server is listening on this link http://localhost:${3000}`);
    });
  })
  .catch((err) => {
    console.log("database can not connect");
  });
