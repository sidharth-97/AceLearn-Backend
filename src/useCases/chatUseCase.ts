import ConversationRepository from "../infrastructure/repository/conversationRepository";
import { Conversation } from "../infrastructure/database/conversationModel";
import MessageRepository from "../infrastructure/repository/messageRepository";
import studentRepository from "../infrastructure/repository/studentRepository";
import { sendNotification } from "../infrastructure/utils/sendNotifications";
import TutorRepository from "../infrastructure/repository/tutorRepository";

class ChatUseCase{
    private ConversationRepo: ConversationRepository;
    private MessageRepo: MessageRepository
    private studentRepo: studentRepository
    private tutorRepo:TutorRepository
    constructor(ConversationRepo: ConversationRepository,MessageRepo:MessageRepository,studentRepo:studentRepository,tutorRepo:TutorRepository) {
        this.ConversationRepo = ConversationRepo
        this.MessageRepo = MessageRepo
        this.studentRepo = studentRepo
        this.tutorRepo=tutorRepo
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
    async checkExisting(members: Array<string>) {
        const isExisting = await this.ConversationRepo.checkExisting(members)
        return isExisting
    }
    async getConversations(id: string) {
        const conversations = await this.ConversationRepo.findByUserId(id)
        console.log(conversations,"conversations=================");
        const message = await this.MessageRepo.getLastMessages()
        console.log(message,"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        const data = {
            conv: conversations,
            messages: message, // You might want to include the messages in your data object
          };
        if (conversations) {
            return {
                status: 200,
                data:data
            }
        } else {
            return {
                status: 400,
                data:"No conversation found"
            }
        }
    }
    async addMessage(data: { conversationId: string, sender: string, text: string }) {
        console.log("add message");
        
       try {
        const conversation = await this.ConversationRepo.findByUserId(data.sender)
        console.log(conversation,"conv");
        
        console.log("Conversation:", conversation);
console.log("Sender:", data.sender);
const receiverId = conversation[0].members.find((id: string) => id !== data.sender);
console.log("ReceiverId:", receiverId);

        
           const user = await this.studentRepo.findById(receiverId)
           const tutor=await this.tutorRepo.findById(receiverId)
        console.log(user);
        await sendNotification(user.token??tutor.token,data.text,"New message")
       } catch (error) {
        console.log(error);
        
       }
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