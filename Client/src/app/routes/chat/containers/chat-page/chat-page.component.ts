import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store';
import { ChatActions, getConversationsSelector } from '../../store';
import { commonImports, materialImports } from '../../../../core';

@Component({
  selector: 'app-chat-page',
  imports: [...commonImports, ...materialImports],
  templateUrl: './chat-page.component.html',
  styleUrls: ['../../../../../styles.scss','./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  conversations$!: Observable<any>;
  conversations!: any;
  selectedConversation!: any;
  
  constructor(private store: Store<AppState>) {
    this.selectConversations();
    this.subscribeConversations();
  }

  ngOnInit(): void {
    this.dispatchConversations()
  }

  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
  }

  private selectConversations() {
    this.conversations$ = this.store.select(getConversationsSelector);
  }

  private subscribeConversations() {
    this.conversations$.subscribe(res => {
      this.conversations = res;
    })
  }

  private dispatchConversations() {
    this.store.dispatch(ChatActions.getConversations());
  }
}
