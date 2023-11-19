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
    async getConversations(id: string) {
        const conversations = await this.ConversationRepo.findByUserId(id)
        if (conversations) {
            return {
                status: 200,
                data:conversations
            }
        } else {
            return {
                status: 400,
                data:"No conversation found"
            }
        }
    }
}

export default ChatUseCase