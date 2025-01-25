const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user data is saved in db succeessfully ");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
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
