interface Conversation{
    members: Array<string>;

}

export default interface ConversationRepoInterface{
    save(conversation:Array<string>):Promise<any>
}