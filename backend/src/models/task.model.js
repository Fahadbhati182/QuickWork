import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    workerId: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "newtask", "completed", "failed"],
      default: "newtask",
    },
    payment: {
      type: Number,
      required: true,
    },
    deadLine: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
