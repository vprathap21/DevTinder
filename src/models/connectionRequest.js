const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // referece to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "rejected", "accepted"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot sent request to yourself");
  }
  next();
});

module.exports = connectionRequestModel;
