import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store';
import { ChatActions, getConversationHistorySelector, getConversationsSelector } from '../../store';
import { commonImports, materialImports } from '../../../../core';
import { Conversation } from '../../../../models/chat';
import { getUserIdSelector } from '../../../../auth/store';

@Component({
  selector: 'app-chat-page',
  imports: [...commonImports, ...materialImports],
  templateUrl: './chat-page.component.html',
  styleUrls: ['../../../../../styles.scss','./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  userId$!: Observable<string | undefined>;
  userId!: string | undefined;
  conversations$!: Observable<Conversation[]>;
  conversations!: Conversation[];
  selectedConversation!: Conversation;
  conversationHistory$!: Observable<any>;
  conversationHistory!: any;
  
  constructor(private store: Store<AppState>) {
    this.selectUserId();
    this.subscribeUserId();
    this.selectConversations();
    this.subscribeConversations();
    this.selectConversationHistory();
    this.subscribeConversationHistory();
  }

  ngOnInit(): void {
    this.dispatchConversations()
  }

  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.dispatchSelectedConversationsInfo();
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
      console.log(res);
    })
  }

  private dispatchConversations() {
    this.store.dispatch(ChatActions.getConversations());
  }
  
  private dispatchSelectedConversationsInfo() {
    if(this.userId) {
      this.store.dispatch(ChatActions.getConversationHistory({ userId: this.userId }))
    }
  }
}
