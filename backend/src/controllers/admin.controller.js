import Admin from '../models/Admin.model.js';
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AysnHandler.js";
import { sendEmail } from "../config/nodemailer.js";
import Worker from "../models/workers.model.js";
import Task from "../models/task.model.js";
import Session from "../models/Sessions.model.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { io, workerSocketMap,  } from "../../server.js";



Admin
export const createAdmin = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiResponse(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({ email });

  if (existedAdmin) {
    throw new ApiResponse(400, "Admin already exists with this email");
  }
  const newAdmin = await Admin.create({ name, email, password });

  if (!newAdmin) {
    throw new ApiResponse(400, "Admin could not be created");
  }

  const token = await newAdmin.generateAuthToken();

  await sendEmail(
    newAdmin.email,
    "Welcome to QuickWork",
    `
    Hi ${newAdmin.name},

    Welcome to QuickWork! We're excited to have you on board.

    Best,
    The QuickWork Team
    `
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .status(201)
    .json(new ApiResponse(200, "Admin created successfully", newAdmin));
});

export const loginAdmin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin not found with this email");
  }

  const isPasswordMatch = await admin.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = await admin.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Admin logged in successfully", admin));
});

export const logoutAdmin = AsyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 0,
  });

  res.status(200).json(new ApiResponse(200, "Admin logged out successfully"));
});

export const getAdminProfile = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized, admin not found");
  }

  const admin = await Admin.findById(adminId).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, "Admin profile fetched successfully", admin));
});

export const isAdmin = AsyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Admin is authenticated"));
});

export const addWorkers = AsyncHandler(async (req, res) => {
  const { name, email, password, phone, skills } = req.body;

  const adminId = req.admin;

  if (!adminId) {
    throw new ApiResponse(401, "Unauthorized, admin not found");
  }
  const admin = await Admin.findById(adminId);

  if (!name || !password || !email || !phone) {
    throw new ApiResponse(400, "All fields are required");
  }

  if (skills && !Array.isArray(skills)) {
    throw new ApiError(400, "Skills must be an array");
  }

  const existedWorker = await Worker.findOne({ email });
  if (existedWorker) {
    throw new ApiError(400, "Worker already exists with this email");
  }

  const newWorker = await Worker.create({
    name,
    email,
    password,
    phone,
    skills,
    adminId,
  });

  if (!newWorker) {
    throw new ApiError(400, "Worker could not be created");
  }

  const session = await Session.create({ name, userId: newWorker._id });

  if (!session) {
    throw new ApiError(401, "Invalid Server Error");
  }

  const token = await newWorker.generateAuthToken();

  await sendEmail(
    newWorker.email,
    "Welcome to QuickWork",
    `
    Hi ${newWorker.name},


    Your Email:${newWorker.email}
    Your Password:${password}


    ${admin.name} has added you as a worker.

    Best,
    The QuickWork Team
    `
  );

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  admin.workersId.push(newWorker._id);
  await admin.save();

  res
    .status(201)
    .json(new ApiResponse(201, "Worker created successfully", newWorker));
});

export const getAllWorkers = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized, admin not found");
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const workers = await Promise.all(
    admin.workersId.map((workerId) => Worker.findById(workerId))
  );

  if (!workers || workers.length === 0) {
    throw new ApiResponse(404, "No workers found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "All workers fetched successfully", workers));
});

export const createTask = AsyncHandler(async (req, res) => {
  const { title, description, assignedTo, deadLine, payment } = req.body;

  if (!title || !description || !assignedTo || !deadLine || !payment) {
    throw new ApiResponse(400, "All fields are required");
  }

  const adminId = req.admin;

  if (!adminId) {
    throw new ApiError(401, "Unauthorized, admin not found");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

 
  const worker = await Worker.findOne({ name: assignedTo });

  if (!worker) {
    throw new ApiResponse(404, "Worker not found");
  }

  const newTask = await Task.create({
    title,
    description,
    assignedTo: worker.name,
    deadLine,
    payment,
    adminId: admin._id,
    workerId: worker._id,
  });

  if (!newTask) {
    throw new ApiResponse(400, "Task could not be created");
  }


  admin.taskId.push(newTask._id);
  worker.taskId.push(newTask._id);
  worker.taskCount.newTask = worker.taskCount.newTask + 1;

  await admin.save();
  await worker.save();

  const workerSocketId = workerSocketMap[worker._id];
  
  if (workerSocketId) {
    io.to(workerSocketId).emit("newTask", newTask);
  }

  await sendEmail(
    worker.email,
    "New Task Assigned",
    `
    Hi ${worker.name},

    You have been assigned a new task by your admin ${admin.name}.

    Please find the details below:
    Title: ${newTask.title}
    Deadline: ${newTask.deadLine}
    Payment: ₹${newTask.payment}

    Best,
    The QuickWork Team
    `
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Task created successfully", newTask));
});

export const getAllTasks = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized, admin not found");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const tasks = await Promise.all(
    admin.taskId.map((taskId) => Task.findById(taskId))
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Task Fetched successfully", tasks));
});

export const toFetchEmployeData = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized, admin not found");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  const tasks = await Task.find({ adminId });

  if (!tasks) {
    throw new ApiError(401, "Internal Server Error");
  }

  const totalTaskCompleted = tasks.filter(
    (task) => task.status.toLowerCase() == "completed"
  )?.length;

  const adminWorkers = await Promise.all(
    admin.workersId.map((workerId) => Worker.findById(workerId))
  );
  const isActiveWoker = adminWorkers.filter(
    (worker) => worker && worker.isActive
  ).length;

  const totalEmployee = admin.workersId.length;
  const totalTasks = admin.taskId.length;

  const adminData = [
    { title: "Total Employees", count: totalEmployee },
    { title: "Active Employees", count: isActiveWoker },
    { title: "Total Tasks", count: totalTasks },
    { title: "Tasks Completed", count: totalTaskCompleted },
  ];

  return res
    .status(200)
    .json(new ApiResponse(200, "Admin Data Fetch SuccessFully", adminData));
});

export const updateWorker = AsyncHandler(async (req, res) => {
  const { name, email, phone, skills, workerId } = req.body;

  const adminId = req.admin;

  if (!workerId) {
    throw new ApiResponse(401, " Worker not found");
  }

  if (!adminId) {
    throw new ApiResponse(401, "Unauthorized, admin not found");
  }
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiResponse(401, "Unauthorized, admin not found");
  }

  if (!name || !email || !phone) {
    throw new ApiResponse(400, "All fields are required");
  }

  if (skills && !Array.isArray(skills)) {
    throw new ApiError(400, "Skills must be an array");
  }

  const workers = await Worker.findByIdAndUpdate(
    workerId,
    {
      $set: {
        name,
        email,
        phone,
        skills,
      },
    },
    { new: true }
  );

  if (!workers) {
    throw new ApiResponse(401, "Unauthorized, worker not found");
  }


  return res
    .status(200)
    .json(new ApiResponse(200, "Worker Data Updated SuccessFully", workers));
});

export const deleteWorker = AsyncHandler(async (req, res) => {
  const { workerId } = req.body;

  const adminId = req.admin;

  if (!workerId) {
    throw new ApiResponse(401, " Worker not found");
  }

  if (!adminId) {
    throw new ApiResponse(401, "Unauthorized, admin not found");
  }
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiResponse(401, "Unauthorized, admin not found");
  }

  await Admin.updateOne(
    { workersId: workerId },
    { $pull: { workersId: workerId } }
  );

  await Worker.findByIdAndDelete(workerId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Worker Deleted  SuccessFully"));
});

export const changeAdminDetasils = AsyncHandler(async (req, res) => {
  const { name, email } = req.body;
 

  if (!name || !email) {
    res.json(new ApiError(401, "All Fields are required"));
  }

  const adminId = req.admin;

  if (!adminId) {
    res.json(new ApiError(401, "Unauthorized to change details"));
  }

  const updatedUser = await Admin.findByIdAndUpdate(
    adminId,
    { name, email },
    { new: true }
  );

  if (!updatedUser) {
    res.json(new ApiError(401, "Something went wrong"));
  }

  res
    .status(200)
    .json(new ApiError(401, "Admin Details Changed successfully", updatedUser));
});

export const sendResetOtp = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.json(new ApiError(401, "All Fields are required"));
  }

  const adminId = req.admin;
  

  if (!adminId) {
    res.json(new ApiError(401, "Not authorized"));
  }

  const admin = await Admin.findOne({ email });
 
  if (!admin) {
    res.json(new ApiError(401, "Not authorized"));
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  admin.resetOtp = otp;
  admin.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;
  await admin.save();

  await sendEmail(
    admin.email,
    "Password Reset OTP",
    `
    Hi ${admin.name},

    Your OTP for password reset is: ${otp}

    This OTP is valid for 10 minutes.

    If you did not request this, please ignore this email.

    Best,
    The QuickWork Team
    `
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Reset otp Send Successfully"));
});

export const resetPassword = AsyncHandler(async (req, res) => {
  const { otp, newPassword, email } = req.body;

  

  if ([email, newPassword, otp].some((fields) => fields?.trim() == "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const adminId = req.admin;
  if (!adminId) {
    res.json(new ApiError(401, "Not authorized"));
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.json(new ApiError(401, "Not authorized"));
  }

  if (admin.resetOtp != otp && admin.resetOtp == "") {
    res.json(new ApiError(401, "Invalid OTP"));
  }

  if (admin.resetOtpExpiresAt < Date.now()) {
    throw new ApiError(400, "OTP Expired!! ");
  }

  admin.password = newPassword;
  admin.resetOtp = "";
  admin.resetOtpExpiresAt = 0;

  await admin.save();

  res.status(200).json(new ApiResponse(200, "Password reset Successfully"));
});

export const uploadProfilePic = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    res.json(new ApiError(401, "Not authorized"));
  }

  const filePath = req.file.path;
  if (!filePath) {
    res.json(new ApiError(401, "File Not Found"));
  }

  const upload = await cloudinary.uploader.upload(filePath);
 

  const admin = await Admin.findByIdAndUpdate(
    adminId,
    {
      profilePic: upload.secure_url,
    },
    { new: true }
  );
  await fs.unlink(filePath);


  res.json(new ApiResponse(200, "Admin ProfilePic Uploaded", admin));
});
  