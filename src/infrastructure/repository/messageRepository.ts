import MessageRepoInterface from "../../useCases/interface/messageRepoInterface";
import { MessageModel } from "../database/messageModel";

class MessageRepository implements MessageRepoInterface{
     async save(data: any): Promise<any> {
         const message = new MessageModel(data)
         const save = await message.save()
         if (save) {
             return save
         } else {
             return null
         }
    }
    async findById(id: string): Promise<any> {
        const messages = await MessageModel.find({ conversationId: id })
        if (messages) {
            return messages
        } else {
            return null
        }
    }
}

export default MessageRepository