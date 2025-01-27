const express = require("express");
const connectDb = require("./config/database");
const cookieparser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieparser());

const { authRouter } = require("./Routes/auth");
const { profileRouter } = require("./Routes/profile");
const { requestRouter } = require("./Routes/request");
const { userRouter } = require("./Routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
