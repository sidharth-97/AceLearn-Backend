import JWT from "../../useCases/interface/jwtInterface";
import jwt from 'jsonwebtoken'

class jwtToken implements JWT{
    createJWT(userId: string): string {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey) {
            const token: string = jwt.sign({ id: userId }, jwtKey);  
          return token;
        }
        throw new Error("JWT_KEY is not defined");
      }
    
}

export default jwtToken