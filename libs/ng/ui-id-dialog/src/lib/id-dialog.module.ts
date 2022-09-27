import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { IdDialogComponent } from './id-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  declarations: [
    IdDialogComponent,
  ],
  exports: [
    IdDialogComponent
  ]
})
export class IdDialogModule {}
