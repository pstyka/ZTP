import { Component } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { Flat } from '../../../../models/flat';
import { FlatActions } from '../../store';

@Component({
  selector: 'app-add-flat',
  standalone: true,
  imports: [...commonImports, ...materialImports],
  templateUrl: './add-flat.component.html',
  styleUrls: ['../../../../../styles.scss', './add-flat.component.scss']
})
export class AddFlatComponent {
  form!: FormGroup;

  
  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      city: [''],
      district: [''],
      street: [''],
      buildingNumber: [''],
      flatNumber: [''],
      postalCode: [''],
      rooms: [1],
      area: [0.0],
      price: [0.0],
      isAvailable: [true]
    });
  }

  submit() {
    if (this.form.valid) {
      this.store.dispatch(FlatActions.addFlat({ flat: this.form.value as Flat }));
      this.resetForm();
    }
  }

  resetForm() {
    this.form.patchValue({
      name: [''],
      description: [''],
      city: [''],
      district: [''],
      street: [''],
      buildingNumber: [''],
      flatNumber: [''],
      postalCode: [''],
      rooms: [1],
      area: [0.0],
      price: [0.0],
      isAvailable: [true]
    });
  }
}
