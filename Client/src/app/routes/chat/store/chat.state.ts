import { Conversation, Message } from "../../../models/chat";

export interface ChatState {
    conversations: Conversation[];
    conversationHistory: Message[];
}