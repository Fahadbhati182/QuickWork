import http from "http";
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/connectDB.js";
import adminRouter from "./src/routes/admin.route.js";
import workersRouter from "./src/routes/workers.route.js";
import connectCloudinary from "./src/config/connectCloudinary.js";
import messageRouter from "./src/routes/message.route.js";
import { Server } from "socket.io";

await connectCloudinary();
await connectDB();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const workerSocketMap = {}; //* {workerId:socketId}
export const adminSocketMap = {}; //* {adminId:socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role;


  if (userId && role == "worker") workerSocketMap[userId] = socket.id;
  if (userId && role == "admin") adminSocketMap[userId] = socket.id;


  io.emit("getOnlineWorkers", Object.keys(workerSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete workerSocketMap[userId];
    io.emit("getOnlineWorkers", Object.keys(workerSocketMap));
  });
});

const allowedOrigin = ["http://localhost:5173"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));

//*  Routes
app.use("/api/admin", adminRouter);
app.use("/api/worker", workersRouter);
app.use("/api/message", messageRouter);

app.use((_, res) => {
  res.status(404).send("404 Not Found");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
