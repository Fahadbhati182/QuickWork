import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AysnHandler.js";
import Worker from "../models/workers.model.js";
import { sendEmail } from "../config/nodemailer.js";
import Session from "../models/Sessions.model.js";
import Task from "../models/task.model.js";
import { v2 as cloudinary } from "cloudinary";
import Admin from '../models/Admin.model.js';

export const loginWorker = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const worker = await Worker.findOne({ email });

  if (!worker) {
    throw new ApiError(404, "Worker not found with this email");
  }

  const isPasswordMatch = await worker.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const session = await Session.create({
    userId: worker._id,
    name: worker.name,
  });

  if (!session) {
    throw new ApiError(401, "Invalid Server Error");
  }

  const token = await worker.generateAuthToken();

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Worker logged in successfully", worker));
});

export const logoutWorker = AsyncHandler(async (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 0,
  });

  res.status(200).json(new ApiResponse(200, "Worker logged out successfully"));
});

export const getWorkerProfile = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId).select("-password");
  
  res
    .status(200)
    .json(new ApiResponse(200, "Worker profile fetched successfully", worker));
});

export const getAllTasks = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const tasks = await Task.find({ workerId: workerId });

  res
    .status(200)
    .json(new ApiResponse(200, "Workers tasks fetched successfully", tasks));
});

export const toggleActiveStatus = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  worker.isActive = !worker.isActive;
  worker.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Your's Status Changed sucessfully"));
});

export const getWorkersAdminDetails = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const admin = await Admin.findById(worker.adminId);
  if (!admin) {
    throw new ApiError(401, "admin not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Worker's admin details fetched  sucessfully", admin)
    );
});

export const getTasksCount = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const active = worker.taskCount.active;
  const newTask = worker.taskCount.newTask;
  const completed = worker.taskCount.completed;
  const failed = worker.taskCount.failed;

  const taskCount = [
    { title: "Active Task", count: active },
    { title: "NewTask", count: newTask },
    { title: "Completed Task", count: completed },
    { title: "Failed Task", count: failed },
  ];

  res
    .status(200)
    .json(
      new ApiResponse(200, "Worker's taskCount fetched  sucessfully", taskCount)
    );
});

export const markTaskAsCompleted = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const task = await Task.findById(id);

  task.status = "completed";
  worker.taskCount.active -= 1;
  worker.taskCount.completed += 1;

  await task.save();
  await worker.save();

  return res.status(200).json(new ApiResponse(200, "Task Status updated"));
});

export const markTaskAsFailed = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const task = await Task.findById(id);

  task.status = "failed";
  worker.taskCount.active -= 1;
  worker.taskCount.failed += 1;

  await task.save();
  await worker.save();

  return res.status(200).json(new ApiResponse(200, "Task Status updated"));
});

export const markTaskAsActive = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const task = await Task.findById(id);

  task.status = "active";
  worker.taskCount.newTask = worker.taskCount.newTask -= 1;
  worker.taskCount.active = worker.taskCount.active + 1;

  await task.save();
  await worker.save();

  return res.status(200).json(new ApiResponse(200, "Task Status updated"));
});

export const sendVerifyOtp = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  if (worker.isAccountVerify) {
    res.json(new ApiResponse(200, "Accound is already verified", null));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  worker.verifyOtp = otp;
  worker.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000;
  await worker.save();

  await sendEmail(
    worker.email,
    "Verify your email",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Email Verify OTP sent Successfully"));
});

export const verifyEmail = AsyncHandler(async (req, res) => {
  const { otp } = req.body;
  
  if (!otp) {
    throw new ApiError(401, "OTP not Found!!!");
  }
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findById(workerId);
  

  if (!worker) {
    return res.json(new ApiError(400, "worker not authenticated"));
  }

  if (worker.verifyOtp == "" || worker.verifyOtp !== otp) {
    throw new ApiError(401, "Invalid OTP!!");
  }

  if (worker.verifyOtpExpiresAt < Date.now()) {
    return res.json(new ApiError(400, "OTP Expired !!"));
  }

  worker.verifyOtp = "";
  worker.verifyOtpExpiresAt = 0;
  worker.isAccountVerify = true;
  worker.save();

  await sendEmail(
    worker.email,
    "Email Verified Successfully",
    "Your email has been successfully verified. Thank you!"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Email Verify Successfully"));
});

export const sendResetOtp = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(401, "email is requried");
  }

  const worker = await Worker.findOne({ email });
  if (!worker) {
    throw new ApiError(401, "worker not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  worker.resetOtp = otp;
  worker.resetOtpExpiresAt =  Date.now() + 10 * 3600 * 1000;
  await worker.save();
 

  await sendEmail(
    worker.email,
    "Reset your password",
    `Your OTP for password reset is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Reset OTP Sent Successfully"));
});

export const resetPassword = AsyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
 

  if ([email, newPassword, otp].some((fields) => fields?.trim() == "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const worker = await Worker.findOne({ email });
  if (!worker) {
    throw new ApiError(400, "Invalid Email");
  }

  if (worker.resetOtp !== otp || worker.resetOtp == "") {
    throw new ApiError(400, "Invalid OTP");
  }

 if (!worker.resetOtpExpiresAt || worker.resetOtpExpiresAt < Date.now()) {
  throw new ApiError(400, "OTP Expired!!");
}


  worker.password = newPassword;
  worker.resetOtp = "";
  worker.resetOtpExpiresAt = 0;

  await worker.save();

  res.status(200).json(new ApiResponse(200, "Password reset Successfully"));
});

export const updateProfileInformation = AsyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Fields are required");
  }
  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const worker = await Worker.findByIdAndUpdate(
    workerId,
    {
      name,
      email,
    },
    { new: true }
  );

  return res.json(
    new ApiResponse(200, "Workers Information updated sucessfully", worker)
  );
});

export const createBio = AsyncHandler(async (req, res) => {
  const bio = req.body.bio;

  if (!bio) {
    throw new ApiError(400, "Fields are required");
  }
  const filePath = req.file.path;

  const workerId = req.worker;
  if (!workerId) {
    throw new ApiError(401, "Unauthorized, worker not found");
  }

  const upload = await cloudinary.uploader.upload(filePath);

  const worker = await Worker.findByIdAndUpdate(
    workerId,
    { profilePic: upload.secure_url, bio: bio },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Your Bio is Updated", worker));
});
