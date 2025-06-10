export interface Message {
    id?: string;
    sender_id?: string;
    receiver_id?: string;
    sender_name?: string;
    receiver_name?: string;
    content?: string;
    created_at?: string;
    error?: string;
}