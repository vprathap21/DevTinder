const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //   if (fromUserId === toUserId) {
      //     return res.status(400).json({ message: "can't send request yourself" });
      //   }

      const istoUserExist = await User.findById({ _id: toUserId });
      if (!istoUserExist) {
        return res.status(400).json({ message: "user not exist!!" });
      }

      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type: " + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: " Connection Request Already Exsist!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " is " +
          status +
          " in " +
          istoUserExist.firstName,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const logedinUser = req.user;
      const { status, requestId } = req.params;
      // console.log(status);
      // console.log(requestId);
      // console.log(logedinUser);
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: logedinUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({ message: "Connection not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection reques " + status, data: data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = { requestRouter };
