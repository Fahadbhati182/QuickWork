import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiresAt: {
      type: Number,
      default: false,
    },
    isAccountVerify: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiresAt: {
      type: Number,
      default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      default: "worker",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    taskCount: {
      active: { type: Number, default: 0, min: 0 },
      newTask: { type: Number, default: 0, min: 0 },
      completed: { type: Number, default: 0, min: 0 },
      failed: { type: Number, default: 0, min: 0 },
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    taskId: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, minimize: false }
);

workerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

workerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

workerSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
