import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import studentRepository from '../repository/studentRepository';
import TutorRepository from '../repository/tutorRepository';

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
    const id: string = (req as any)?.user?.id; 
    const repository = new studentRepository();
    const user =await repository.findById(id);
    console.log(user);
    if (user.isBlocked) {
      return res.status(401).json({ message: 'Admin blocked' });
    }
    console.log("final");
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const protectTutor = async(req: Request, res: Response, next: NextFunction)=>{
  const token = req.cookies.Tutorjwt
  if (!token) {
    return res.status(401).json({message:"AccessDenied"})
  }
  try {
    const decoded: any = jwt.verify(token, "thisisthesecretkey");
    (req as any).user = decoded
    
    const email: string = (req as any)?.user?.id;
    const repository = new TutorRepository()
    const tutor=await repository.findByEmail(email)
    console.log(tutor);
    if (tutor.isBlocked) {
  return res.status(401).json({message:"Blocked by Admin"})
    } 
    next()
  } catch (error) {
    return res.status(401).json({message:"Invalid Token"})
  }
}