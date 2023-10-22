import bcrypt from 'bcrypt';
import Hashpassword from '../../useCases/interface/hashpassword';

class Encrypt implements Hashpassword{
    async createHash(password: string): Promise<string> {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashpassword = await bcrypt.hash(password, salt)
        return hashpassword
    }

    async compare(password: string, hashpassword: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hashpassword)
        return match
    }
}

export default Encrypt