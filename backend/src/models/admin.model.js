import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiresAt: {
      type: Number,
      default: false,
    },
    role: {
      type: String,
      default: "admin",
    },
    workersId: [
      {
        type: String,
      },
    ],
    taskId: [
      {
        type: String,
      },
    ],
  },
  { minimize: true }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
