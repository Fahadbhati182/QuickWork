import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 10 * 60 * 60,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
