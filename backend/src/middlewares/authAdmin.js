import jwt from "jsonwebtoken";
import AsyncHandler from "../utils/AysnHandler.js";

const authAdmin = AsyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.admin = decoded.id;
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
});

export default authAdmin;
