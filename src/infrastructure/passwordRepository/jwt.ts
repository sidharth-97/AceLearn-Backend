import JWT from "../../useCases/interface/jwtInterface";
import jwt from 'jsonwebtoken'

class jwtToken implements JWT{
    createJWT(userId: any,role:string): string {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey) {
            const token: string = jwt.sign({ id: userId,role:role}, jwtKey);  
          return token;
        }
        throw new Error("JWT_KEY is not defined");
  }
   verifyJWT(data: any): any {
     const decoded = jwt.verify(data,`${process.env.JWT_KEY}`); 
     return decoded
   }
}

export default jwtToken