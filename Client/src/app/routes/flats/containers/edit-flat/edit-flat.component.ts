import { Component, OnDestroy, OnInit } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { Flat } from '../../../../models/flat';
import { FlatActions, getFlatSelector } from '../../store';
import { Observable, Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-edit-flat',
  standalone: true,
  imports: [...commonImports, ...materialImports],
  templateUrl: './edit-flat.component.html',
  styleUrls: ['../../../../../styles.scss', './edit-flat.component.scss']
})
export class EditFlatComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  selectedFiles: File[] = [];
  flatId!: string;
  flat$!: Observable<Flat | undefined>;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private actions$: Actions,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [''],
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
      photos: ['']
    });

    this.selectGetFlat();
    this.subscribeGetFlat();
    this.subscribeEditFlatSuccess();
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id')!;

    this.dispatchGetFlat();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(): void {
    if (this.form.valid) {
      this.store.dispatch(FlatActions.editFlat({ flat: this.form.value as Flat }));
      this.router.navigate(['/my-profile']);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  private subscribeEditFlatSuccess() {
  //   this.subscription.add(
  //     this.actions$.pipe(ofType(FlatActions.editFlatSuccess)).subscribe(({ id }) => {
  //       if (this.selectedFiles.length) {
  //         this.store.dispatch(FlatActions.addFlatPhotos({ id, photos: this.selectedFiles }));
  //       }
  //     })
  //   );
  }

  private dispatchGetFlat() {
    if(this.flatId) {
      this.store.dispatch(FlatActions.getFlat({id: this.flatId}))
    }
  }

  private selectGetFlat() {
    this.flat$ = this.store.select(getFlatSelector);
  }

  private subscribeGetFlat() {
    this.flat$.subscribe(flat => {
      if (flat) {
        this.form.patchValue(flat);
      }
    })
  }
}
