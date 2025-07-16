import jwt from "jsonwebtoken";
import AsyncHandler from "../utils/AysnHandler.js";
import Session from "../models/Sessions.model.js";

const authWorker = AsyncHandler(async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   

    const session = await Session.findOne({userId:decoded.id});
  

    if (!session) {
      return res.status(401).json({ message: "Unauthorized Employe" });
    }

    if (decoded.id) {
      req.worker = decoded.id;
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
});

export default authWorker;
