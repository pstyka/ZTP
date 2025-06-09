import { Component, OnInit } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { FlatActions, getFlatsSelector } from '../../../flats/store';
import { Observable } from 'rxjs';
import { Flat } from '../../../../models/flat';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [...commonImports, ...materialImports],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../styles.scss', './home.component.scss']
})
export class HomeComponent implements OnInit{
  filterForm!: FormGroup;
  flats$!: Observable<Flat[] | undefined>;
  flats!: Flat[] | undefined;

  constructor(private store: Store<AppState>, private router: Router, private fb: FormBuilder) {
    this.selectFlats();
    this.subscribeFlats();
  }

  ngOnInit(): void {
    this.initFilterForm();
    this.dispatchFlats();
  }

  getFlatLocation(flat: any): string {
    const city = flat.city ? `${flat.city},` : '';
    const district = flat.district ? `${flat.district},` : '';
    const street = flat.street ? `${flat.street} st` : '';
    return [city, district, street].filter(part => part.trim()).join(' ');
  }

  goToFlat(flat: Flat): void {
    this.router.navigate(['/flats/preview', flat?.id]);
  }

  mapPhoto(url: string | undefined) {
      return `${environment.apiUrlTmp}${url}`;
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      city: [''],
      rooms: [''],
      minPrice: [''],
      maxPrice: [''],
      minArea: [''],
      maxArea: ['']
    });
  }

  applyFilters() {
    console.log(this.filterForm.value);
  }

  clearFilters() {
    this.filterForm.patchValue({
      city: [''],
      rooms: [''],
      minPrice: [''],
      maxPrice: [''],
      minArea: [''],
      maxArea: ['']
    });

    this.dispatchFlats();
  }

  private selectFlats() {
    this.flats$ = this.store.select(getFlatsSelector);
  }

  private subscribeFlats() {
    this.flats$.subscribe(flats => {
      this.flats = flats;
    })
  }

  private dispatchFlats() {
    this.store.dispatch(FlatActions.getFlats());
  }
}
