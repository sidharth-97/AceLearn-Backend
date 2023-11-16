import JWT from "../../useCases/interface/jwtInterface";
import jwt from 'jsonwebtoken'

class jwtToken implements JWT{
    createJWT(userId: any): string {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey) {
            const token: string = jwt.sign({ id: userId }, jwtKey);  
          return token;
        }
        throw new Error("JWT_KEY is not defined");
  }
   verifyJWT(data: any): any {
     const decoded = jwt.verify(data, "thisisthesecretkey"); 
     return decoded
   }
}

export default jwtToken