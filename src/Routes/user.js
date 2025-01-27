const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age about photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logedinUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: logedinUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched succesfully!",
      requests: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logedinUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: logedinUser._id, status: "accepted" },
        { fromUserId: logedinUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === logedinUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      message: "Data fetched succesfully!",
      requests: data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const logedinUser = req.user;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: logedinUser._id }, { toUserId: logedinUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: logedinUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = {
  userRouter,
};
