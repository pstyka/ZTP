import { Component, inject } from '@angular/core';
import { commonImports, materialImports } from '../../../core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [...commonImports, ...materialImports],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  close(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
