import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { commonImports, materialImports } from '../../../../core';

@Component({
  selector: 'app-send-message-dialog',
  imports: [...commonImports, ...materialImports],
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['../../../../../styles.scss', './send-message-dialog.component.scss']
})
export class SendMessageDialogComponent {
  messageForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SendMessageDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { flatId: string }
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  send(): void {
    if (this.messageForm.valid) {
      const message = this.messageForm.value.message;
      this.dialogRef.close(message);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
