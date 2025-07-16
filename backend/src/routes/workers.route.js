import express from "express";
import {
  createBio,
  getAllTasks,
  getTasksCount,
  getWorkerProfile,
  getWorkersAdminDetails,
  loginWorker,
  logoutWorker,
  markTaskAsActive,
  markTaskAsCompleted,
  markTaskAsFailed,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  toggleActiveStatus,
  updateProfileInformation,
  verifyEmail,
} from "../controllers/workers.controller.js";
import authWorker from "../middlewares/authWorker.js";
import upload from "../config/multer.js";

const workersRouter = express.Router();

workersRouter.post("/login", loginWorker);
workersRouter.get("/logout", logoutWorker);
workersRouter.get("/profile", authWorker, getWorkerProfile);
workersRouter.post("/send-verify-otp", authWorker, sendVerifyOtp);
workersRouter.post("/verify-email", authWorker, verifyEmail);
workersRouter.post("/send-reset-otp", authWorker, sendResetOtp);
workersRouter.post("/reset-password", authWorker, resetPassword);
workersRouter.post("/update-profile", authWorker, updateProfileInformation);
workersRouter.post("/upload-bio",upload.single('image'),authWorker,createBio)

workersRouter.get("/get-all-tasks", authWorker, getAllTasks);
workersRouter.put("/change-status", authWorker, toggleActiveStatus);
workersRouter.get("/worker-admin-detail", authWorker, getWorkersAdminDetails);
workersRouter.get("/worker-task-count", authWorker, getTasksCount);
workersRouter.post("/mark-completed/:id", authWorker, markTaskAsCompleted);
workersRouter.post("/mark-failed/:id", authWorker, markTaskAsFailed);
workersRouter.post("/mark-active/:id", authWorker, markTaskAsActive);

export default workersRouter;
