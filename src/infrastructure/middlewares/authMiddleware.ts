import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import studentRepository from '../repository/studentRepository';

export const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.Studentjwt
console.log(token,"here it is");

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token,"thisisthesecretkey"); 

    (req as any).user = decoded;
    console.log(req?.user, "thhis is the request");
    const email: string = (req as any)?.user?.id; 
    const repository = new studentRepository();
    const user =await repository.findByEmail(email);
    console.log(user);
    if (user.isBlocked) {
      return res.status(401).json({ message: 'No Access' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const protectTutor = (req: Request, res: Response, next: NextFunction)=>{
  const token = req.cookies.Tutorjwt
  if (!token) {
    return res.status(401).json({message:"AccessDenied"})
  }
  try {
    const decoded: any = jwt.verify(token, "thisisthesecretkey");
      (req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({message:"Invalid Token"})
  }
}