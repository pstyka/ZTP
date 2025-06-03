import { Component, OnInit } from '@angular/core';
import { commonImports, materialImports } from '../../../../core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { FlatActions, getFlatsSelector } from '../../../flats/store';
import { Observable } from 'rxjs';
import { Flat } from '../../../../models/flat';
import { FlatService } from '../../../../services';

@Component({
  selector: 'app-home',
  imports: [...commonImports, ...materialImports],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../styles.scss', './home.component.scss']
})
export class HomeComponent implements OnInit{
  flats$!: Observable<Flat[] | undefined>;
  flats!: Flat[] | undefined;

  constructor(private store: Store<AppState>, private flatService: FlatService) {
    this.selectFlats();
    this.subscribeFlats();
  }

  ngOnInit(): void {
    this.dispatchFlats();
  }

  getFlatLocation(flat: any): string {
    const city = flat.city ? `${flat.city},` : '';
    const district = flat.district ? `${flat.district},` : '';
    const street = flat.street ? `${flat.street} st` : '';
    return [city, district, street].filter(part => part.trim()).join(' ');
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
