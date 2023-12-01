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
    async getLastMessages():Promise<any>{
        try {
          const lastMessages = await MessageModel.aggregate([
            {
              $sort: { createdAt: -1 }, // Sort messages in descending order by createdAt
            },
            {
              $group: {
                _id: "$conversationId",
                lastMessage: { $first: "$$ROOT" }, // Select the first message in each group (latest)
              },
            },
            {
              $replaceRoot: { newRoot: "$lastMessage" }, // Replace the root with the selected message
            },
          ]);
      
          return lastMessages;
        } catch (error) {
          console.error("Error fetching last messages:", error);
        }
      };
}

export default MessageRepository