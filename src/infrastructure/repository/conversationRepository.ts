import ConversationRepoInterface from "../../useCases/interface/conversationRepoInterface";
import { ConversationModel } from "../database/conversationModel";
import { Conversation } from "../database/conversationModel";

class ConversationRepository implements ConversationRepoInterface {
  async save(membersArray: Array<string>): Promise<any> {
    try {
      const newconversation = new ConversationModel({ members: membersArray });
      const save = await newconversation.save();
      if (save) {
        return save;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

    async findByUserId(id: string): Promise<any> {
        
        const conversations = await ConversationModel.find({ members: { $in: [ id ] } })
        if (conversations) {
            return conversations
        } else {
            return null
        }
  }
}

export default ConversationRepository;
