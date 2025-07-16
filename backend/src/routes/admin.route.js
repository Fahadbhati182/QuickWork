import express from "express";
import {
  addWorkers,
  changeAdminDetasils,
  createAdmin,
  createTask,
  deleteWorker,
  getAdminProfile,
  getAllTasks,
  getAllWorkers,
  isAdmin,
  loginAdmin,
  logoutAdmin,
  resetPassword,
  sendResetOtp,
  toFetchEmployeData,
  updateWorker,
  uploadProfilePic,
} from "../controllers/admin.controller.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../config/multer.js";

const adminRouter = express.Router();

adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/logout", logoutAdmin);
adminRouter.get("/profile", authAdmin, getAdminProfile);
adminRouter.get("/is-admin", authAdmin, isAdmin);
adminRouter.post("/add-worker", authAdmin, addWorkers);
adminRouter.post("/update-worker", authAdmin, updateWorker);
adminRouter.post("/delete-worker", authAdmin, deleteWorker);
adminRouter.get("/getAllWorker", authAdmin, getAllWorkers);
adminRouter.get("/getAllTasks", authAdmin, getAllTasks);
adminRouter.post("/create-task", authAdmin, createTask);
adminRouter.get("/to-get-employeData", authAdmin, toFetchEmployeData);
adminRouter.post("/change-adminDetails", authAdmin, changeAdminDetasils);
adminRouter.post("/send-reset-otp", authAdmin, sendResetOtp);
adminRouter.post("/reset-password", authAdmin, resetPassword);
adminRouter.post("/upload-profilePic",upload.single("image"),authAdmin,uploadProfilePic)

export default adminRouter;
