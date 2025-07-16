import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import {
  getAdminForWorker,
  getAdminMessages,
  getAllWorkersForSlider,
  getWorkerMessages,
  markMessageAsSeen,
  sendMessagesForAdmin,
  sendMessagesForWorker,
} from "../controllers/message.controller.js";
import upload from "../config/multer.js";
import authWorker from "../middlewares/authWorker.js";

const messageRouter = express.Router();

messageRouter.post("/get-all-workers", authAdmin, getAllWorkersForSlider);
messageRouter.post("/get-admin-messages/:id", authAdmin, getAdminMessages);
messageRouter.post("/send-admin-messages/:id",upload.single('image'), authAdmin, sendMessagesForAdmin);
messageRouter.put("/mark/:id", authAdmin, markMessageAsSeen);

messageRouter.post("/get-admin", authWorker, getAdminForWorker);
messageRouter.post("/get-worker-messages/:id", authWorker, getWorkerMessages);
messageRouter.post("/send-worker-messages/:id",upload.single('image'), authWorker, sendMessagesForWorker);




export default messageRouter;
