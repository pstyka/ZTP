import { Component } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-flat',
  standalone: true,
  imports: [...commonImports, ...materialImports],
  templateUrl: './add-flat.component.html',
  styleUrls: ['../../../../../styles.scss', './add-flat.component.scss']
})
export class AddFlatComponent {
  form!: FormGroup;

  
  constructor(private fb: FormBuilder) {
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
      console.log('Wysyłam mieszkanie:', this.form.value);
    }
  }
}
