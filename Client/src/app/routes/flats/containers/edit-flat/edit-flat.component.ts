import { Component, OnDestroy, OnInit } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { Flat } from '../../../../models/flat';
import { FlatActions, getFlatPhotosUrlsSelector, getFlatSelector } from '../../store';
import { Observable, Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { getFlatPhotos } from '../../store/actions';
import { environment } from '../../../../../environment';

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
  flatPhotosUrls$!: Observable<string[] | undefined>;

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
    this.selectPhotosUrls();
    this.subscribePhotosUrls();
    this.subscribeEditFlatSuccess();
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id')!;

    this.dispatchGetFlat();
    this.dispatchPhotosUrls();
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

  private dispatchPhotosUrls() {
    if(this.flatId) {
      this.store.dispatch(FlatActions.getFlatPhotos({ id: this.flatId }));
    }
  }

  private selectPhotosUrls() {
    this.flatPhotosUrls$ = this.store.select(getFlatPhotosUrlsSelector)
  }

  private subscribePhotosUrls() {
    this.flatPhotosUrls$.subscribe(async (urls) => {
      if (urls) {
        const fullUrls = urls.map(url => `${environment.apiUrlTmp}${url}`);
        const filePromises = fullUrls.map(async (url) => {
          const nameWithPrefix = url.split('/').pop() ?? 'photo.jpg';
          const nameParts = nameWithPrefix.split('_');
          nameParts.shift();
          const fileName = nameParts.join('_');

          return this.fetchAndConvertToFile(url, fileName);
        });

        this.selectedFiles = await Promise.all(filePromises);
        console.log(this.selectedFiles);
      }
    })
  }

  private async fetchAndConvertToFile(url: string, fileName: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

}
