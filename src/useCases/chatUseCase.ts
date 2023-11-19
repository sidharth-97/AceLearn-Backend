import ConversationRepository from "../infrastructure/repository/conversationRepository";
import { Conversation } from "../infrastructure/database/conversationModel";

class ChatUseCase{
    private ConversationRepo: ConversationRepository;
    constructor(ConversationRepo: ConversationRepository) {
        this.ConversationRepo=ConversationRepo
    }
    async newConversation(members: Array<string>) {
        console.log(members);
        
        const newConversation = await this.ConversationRepo.save(members)
        if (newConversation) {
            return {
                status: 200,
                data:newConversation
            }
        } else {
            return {
                status: 401,
                data:"something went wrong"
            }
        }
    }
}

export default ChatUseCase