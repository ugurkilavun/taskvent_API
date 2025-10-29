import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const authControl = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // req.userData = decoded;
    next();
  } catch (error:any) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};