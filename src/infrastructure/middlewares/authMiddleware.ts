import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import studentRepository from '../repository/studentRepository';
import TutorRepository from '../repository/tutorRepository';
import adminRepository from '../repository/adminRepository';

interface User {
  id: string;
  role: string;
  // Add other properties as needed
}


export const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.Studentjwt
console.log(token,"here it is");

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token,`${process.env.JWT_KEY}`) as User;
    (req as any).user = decoded;
    console.log(req?.user, "this is the request");
  
    const role = (req as any)?.user?.role;
    if (!role) {
      return res.status(401).json({ message: 'Role not found in token' });
    }
  
    const id: string = (req as any)?.user?.id;
    const repository = new studentRepository();
    const user = await repository.findById(id);
    console.log(user);
  
    if (user.isBlocked) {
      return res.status(401).json({ message: 'Admin blocked' });
    }
  
    if (role !== "student") {
      return res.status(401).json({ message: 'Invalid role' });
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
    const decoded: any = jwt.verify(token,`${process.env.JWT_KEY}`);
    (req as any).user = decoded

    const role = (req as any)?.user?.role
    
    if (!role) {
      return res.status(401).json({message:"Role not found in token"})
    }
    
    const id: string = (req as any)?.user?.id;
    const repository = new TutorRepository()
    const tutor=await repository.findById(id)
    console.log(tutor);
    if (tutor.isBlocked) {
  return res.status(401).json({message:"Blocked by Admin"})
    } 
    next()
  } catch (error) {
    return res.status(401).json({message:"Invalid Token"})
  }
}

export const protectAdmin = async (req: Request, res: Response,next:NextFunction)=>{
  const token = req.cookies.Adminjwt
  if (!token) {
    return res.status(401).json({message:"AccessDenied"})
  }
  try {
    const decoded: any = jwt.verify(token, `${process.env.JWT_KEY}`);
    (req as any).user = decoded

    const role = (req as any)?.user?.role
    if (!role) {
      return res.status(401).json({message:"Role is not found in token"})
    }
    const id: string = (req as any)?.user?.id
    const repository = new adminRepository()
    const admin = await repository.findByEmail(id)
    if(admin) next()
  } catch (error) {
    return res.status(401).json({message:"Invalid Token"})
  }
}