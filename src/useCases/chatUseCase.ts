import ConversationRepository from "../infrastructure/repository/conversationRepository";
import { Conversation } from "../infrastructure/database/conversationModel";
import MessageRepository from "../infrastructure/repository/messageRepository";

class ChatUseCase{
    private ConversationRepo: ConversationRepository;
    private MessageRepo:MessageRepository
    constructor(ConversationRepo: ConversationRepository,MessageRepo:MessageRepository) {
        this.ConversationRepo = ConversationRepo
        this.MessageRepo=MessageRepo
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
    async addMessage(data: { conversationId: string, sender: string, text: string }) {
        const message = await this.MessageRepo.save(data)
        if (message) {
            return {
                status: 200,
                data:message
            }
        } else {
            return {
                status: 400,
                data:"Something went wrong"
            }
        }
    }
    async getMessages(convId: string) {
        const messages = await this.MessageRepo.findById(convId)
        if (messages) {
            return {
                status: 200,
                data:messages
            }
        } else {
            return {
                status:401,
                data:"No messages"
            }
        }
    }
}

export default ChatUseCase