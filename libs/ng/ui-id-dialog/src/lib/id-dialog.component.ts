import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'id-dialog',
  templateUrl: './id-dialog.component.html',
  styleUrls: ['./id-dialog.component.scss'],
})
export class IdDialogComponent {
  idControl = new FormControl(null, Validators.required);
}
