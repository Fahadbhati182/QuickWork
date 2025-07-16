import Messages from "../models/messages.model.js";
import Worker from "../models/workers.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AysnHandler.js";
import { adminSocketMap, io, workerSocketMap } from "../../server.js";
import { v2 as cloudinary } from "cloudinary";
import Admin from '../models/Admin.model.js';

// only for admin
export const getAllWorkersForSlider = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  if (!adminId) {
    new ApiError(400, "Unauthorized Admin");
  }

  const admin = await Admin.findById(adminId);
  const adminWorkersIds = admin.workersId;

  const workers = await Promise.all(
    adminWorkersIds.map(
      async (workerId) => await Worker.findById(workerId).select("-password")
    )
  );

  const unseenMessages = {};

  const promise = workers.map(async (worker) => {
    const messages = await Messages.find({
      senderId: worker._id,
      receiverId: adminId,
      seen: false,
    });

    if (messages.length > 0) {
      unseenMessages[worker._id] = messages.length;
    }
  });

  await Promise.all(promise);

  const data = {
    workers: workers,
    unseenMessages: unseenMessages,
  };

  res.json(new ApiResponse(200, " Worker Fetched sucessfully", data));
});

export const getAdminForWorker = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  if (!workerId) {
    new ApiError(400, "Unauthorized Worker");
  }
  const worker = await Worker.findById(workerId);

  if (!worker) {
    new ApiError(400, "Unauthorized Worker");
  }

  const workerAdminId = worker.adminId;

  const admin = await Admin.findById(workerAdminId);
  if (!admin) {
    new ApiError(400, "Admin not  Found");
  }

  const unseenMessages = {};

  const messages = await Messages.find({
    senderId: admin._id,
    receiverId: workerId,
    seen: false,
  });

  if (messages.length > 0) {
    unseenMessages[admin._id] = messages.length;
  }

  const data = {
    admin: admin,
    unseenMessages: unseenMessages,
  };

  res.json(new ApiResponse(200, " Admin Fetched sucessfully", data));
});

export const getAdminMessages = AsyncHandler(async (req, res) => {
  const adminId = req.admin;
  const { id: selectedWorkerId } = req.params;

  if (!adminId) {
    new ApiError(400, "Unauthorized Admin");
  }


  const messages = await Messages.find({
    $or: [
      { senderId: adminId, receiverId: selectedWorkerId },
      { senderId: selectedWorkerId, receiverId: adminId },
    ],
  });

  await Messages.updateMany(
    {
      senderId: selectedWorkerId,
      receiverId: adminId,
    },
    {
      seen: true,
    }
  );
  res.json({ success: true, messages });
});

export const getWorkerMessages = AsyncHandler(async (req, res) => {
  const workerId = req.worker;
  const { id: selectedAdminId } = req.params;
  if (!workerId) {
    new ApiError(400, "Unauthorized Admin");
  }

  const messages = await Messages.find({
    $or: [
      { senderId: workerId, receiverId: selectedAdminId },
      { senderId: selectedAdminId, receiverId: workerId },
    ],
  });

  await Messages.updateMany(
    {
      senderId: selectedAdminId,
      receiverId: workerId,
    },
    {
      seen: true,
    }
  );
  res.json({ success: true, messages });
});

export const markMessageAsSeen = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  await Messages.findByIdAndUpdate(id, { seen: true });
  res.json({ success: true });
});

export const sendMessagesForAdmin = AsyncHandler(async (req, res) => {
  const adminId = req.admin; // authenticated
  const { id } = req.params;

  const { text } = req.body;

  if (!adminId) {
    new ApiError(400, "Unauthorized Admin");
  }

  let imageUrl = null;

  if (req.file && !text) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path);
    imageUrl = uploadRes.secure_url;
  }

 

  const newMessage = await Messages.create({
    senderId: adminId,
    receiverId: id,
    text,
    image: imageUrl,
  });

  const receiverSockerId = workerSocketMap[id];
  if (receiverSockerId) {
    io.to(receiverSockerId).emit("newMessage", newMessage);
  }

  res.json({ success: true, message: newMessage });
});

export const sendMessagesForWorker = AsyncHandler(async (req, res) => {
  const workerId = req.worker; // authenticated
  const { id } = req.params;

  const { text } = req.body;

  if (!workerId) {
    new ApiError(400, "Unauthorized Admin");
  }

  let imageUrl = null;

  if (req.file && !text) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path);
    imageUrl = uploadRes.secure_url;
  }

 

  const newMessage = await Messages.create({
    senderId: workerId,
    receiverId: id,
    text,
    image: imageUrl,
  });

  const receiverSockerId = adminSocketMap[id];
  if (receiverSockerId) {
    io.to(receiverSockerId).emit("newMessage", newMessage);
  }

  res.json({ success: true, message: newMessage });
});
