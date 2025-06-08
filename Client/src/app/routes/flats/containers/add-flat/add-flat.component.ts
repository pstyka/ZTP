import { Component, OnDestroy } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { Flat } from '../../../../models/flat';
import { FlatActions } from '../../store';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-add-flat',
  standalone: true,
  imports: [...commonImports, ...materialImports],
  templateUrl: './add-flat.component.html',
  styleUrls: ['../../../../../styles.scss', './add-flat.component.scss']
})
export class AddFlatComponent implements OnDestroy{
  form!: FormGroup;
  selectedFiles: File[] = [];
  flatId!: number;
  private subscription = new Subscription();
  
  constructor(private fb: FormBuilder, private store: Store<AppState>, private actions$: Actions) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      district: [''],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      flatNumber: [''],
      postalCode: ['', Validators.required],
      rooms: [1, Validators.required],
      area: [0.0, Validators.required],
      price: [0.0, Validators.required],
      isAvailable: [true]
    });

    this.subscribeAddFlatSuccess();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  private subscribeAddFlatSuccess() {
    this.subscription.add(this.actions$
      .pipe(ofType(FlatActions.addFlatSuccess))
      .subscribe(({ id }) => {
        this.store.dispatch(FlatActions.addFlatPhotos({id: id, photos: this.selectedFiles}));
      }));
  }
}
