import jwt from 'jsonwebtoken'
import env from '../env'
import { Request, Response, NextFunction } from 'express'
import ErrorApi from '../Error'

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error()
    const decode = jwt.verify(token, env.secret_key as string) as { userId: string }
    req.body = decode
    next()
  } catch {
    res.status(401).json(new ErrorApi("Access Denied", 401).getError())
  }
}

export default auth