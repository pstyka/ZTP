import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { commonImports, materialImports } from '../../../../core';
import { Message } from '../../../../models/chat';
import { ChatService } from '../../../../services';
import { AppState } from '../../../../store';
import { Store } from '@ngrx/store';
import { getUserIdSelector } from '../../../../auth/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-send-message-dialog',
  imports: [...commonImports, ...materialImports],
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['../../../../../styles.scss', './send-message-dialog.component.scss']
})
export class SendMessageDialogComponent implements OnInit {
  userId$!: Observable<string | undefined>;
  userId: string | undefined;
  messageForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SendMessageDialogComponent>,
    private fb: FormBuilder,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: { flatId: string }
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });

    this.selectUserId();
    this.subscribeUserId();
  }

  ngOnInit(): void {
  }

  send(): void {
    if (this.messageForm.valid) {
      const message = this.messageForm.value.message as Message;

      this.dialogRef.close(message);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private selectUserId() {
    this.userId$ = this.store.select(getUserIdSelector);
  }

  private subscribeUserId() {
    this.userId$.subscribe(res => {
      this.userId = res;
    })
  }
}
