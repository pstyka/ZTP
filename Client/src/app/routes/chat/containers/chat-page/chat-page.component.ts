import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store';
import { ChatActions, getConversationHistorySelector, getConversationsSelector } from '../../store';
import { commonImports, materialImports } from '../../../../core';
import { Conversation, Message } from '../../../../models/chat';
import { getUserIdSelector } from '../../../../auth/store';
import { ChatService } from '../../../../services';

@Component({
  selector: 'app-chat-page',
  imports: [...commonImports, ...materialImports],
  templateUrl: './chat-page.component.html',
  styleUrls: ['../../../../../styles.scss','./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  userId$!: Observable<string | undefined>;
  userId!: string | undefined;
  conversations$!: Observable<Conversation[]>;
  conversations!: Conversation[];
  selectedConversation!: Conversation;
  conversationHistory$!: Observable<Message[]>;
  conversationHistory!: Message[];

  messageText: string = '';
  
  constructor(private store: Store<AppState>, private chatService: ChatService) {
    this.selectUserId();
    this.subscribeUserId();
    this.selectConversations();
    this.subscribeConversations();
    this.selectConversationHistory();
    this.subscribeConversationHistory();
    this.subscribeToMessages();
  }

  ngOnInit(): void {
    this.dispatchConversations()
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.dispatchConversationHistory(conversation.user_id);
  }

  sendMessage(): void {
    const trimmed = this.messageText?.trim();
    if (!trimmed || !this.selectedConversation || !this.userId) return;

    if(this.selectedConversation.user_id && trimmed) {
      this.chatService.sendMessage(this.selectedConversation.user_id, trimmed);
    }

    this.messageText = '';
  }

  private selectUserId() {
    this.userId$ = this.store.select(getUserIdSelector);
  }

  private selectConversations() {
    this.conversations$ = this.store.select(getConversationsSelector);
  }

  private selectConversationHistory() {
    this.conversationHistory$ = this.store.select(getConversationHistorySelector);
  }

  private subscribeUserId() {
    this.userId$.subscribe(res => {
      this.userId = res;
    })
  }

  private subscribeConversations() {
    this.conversations$.subscribe(res => {
      this.conversations = res;
    })
  }

  private subscribeConversationHistory() {
    this.conversationHistory$.subscribe(res => {
      this.conversationHistory = res;
      this.scrollToBottom();
    })
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Failed to scroll', err);
    }
  }

  private subscribeToMessages(): void {
    this.chatService.getMessages().subscribe((message: Message) => {
      if (message.sender_id === this.selectedConversation?.user_id ||
          message.receiver_id === this.selectedConversation?.user_id) {
        this.conversationHistory = [...this.conversationHistory, message];
        this.scrollToBottom();
      }
    });
  }

  private dispatchConversations() {
    this.store.dispatch(ChatActions.getConversations());
  }
  
  private dispatchConversationHistory(id: string | undefined) {
    if(id) {
      this.store.dispatch(ChatActions.getConversationHistory({ userId: id }))
    }
  }
}
