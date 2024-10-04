import { Request, Response, NextFunction } from "express";
import ErrorApi from "../Error";
import User from "../db/Model/User";
const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId
    if (!userId) throw new Error()
    const user = await User.findById(userId)
    if (user?.role !== 'admin') throw new Error()
    next()
  } catch {
    res.status(403).json(new ErrorApi("Access Denied", 403).getError())
  }
}

export default admin