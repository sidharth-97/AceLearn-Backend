import ConversationRepoInterface from "../../useCases/interface/conversationRepoInterface";
import { ConversationModel } from "../database/conversationModel";
import { Conversation } from "../database/conversationModel";

class ConversationRepository implements ConversationRepoInterface{
 async save(membersArray: Array<string>): Promise<any> {
     try {
        const newconversation =new ConversationModel({members:membersArray})
        const save = await newconversation.save()
        if (save) {
            return save
        } else {
            return null
        }
    } catch (error) {
        console.log(error); 
    }
}
}

export default ConversationRepository