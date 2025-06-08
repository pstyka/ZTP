import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ActivatedRoute } from '@angular/router';
import { FlatActions, getFlatPhotosUrlsSelector, getFlatSelector } from '../../store';
import { Observable } from 'rxjs';
import { commonImports, materialImports } from '../../../../core';
import { environment } from '../../../../../environment';
import { Flat } from '../../../../models/flat';
import { getIsLoggedInSelector } from '../../../../auth/store';

@Component({
  selector: 'app-flat-preview',
  imports: [...commonImports, ...materialImports],
  templateUrl: './flat-preview.component.html',
  styleUrls: ['../../../../../styles.scss', './flat-preview.component.scss']
})
export class FlatPreviewComponent implements OnInit {
  flatId!: string;
  flatPhotosUrls$!: Observable<string[] | undefined>;
  flatPhotosUrls!: string[] | undefined;
  flat$!: Observable<Flat | undefined>;
  flat!: Flat| undefined;
  isLoggedIn$!: Observable<boolean | undefined>;
  isLoggedIn!: boolean | undefined;

  private map: L.Map | undefined;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.selectPhotos();
    this.selectFlat();
    this.selectIsLoggedIn();
    this.subscribePhotos();
    this.subscribeFlat();
    this.subscribeIsLoggedIn();
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id')!;
    this.dispatchPhotos();
    this.dispatchFlat();
  }

  private async loadMap(flat: Flat) {
    if (!flat || !flat.city || !flat.street || typeof window === 'undefined') return;

    const address = `${flat.street} ${flat.buildingNumber ?? ''}, ${flat.city}`;
    const query = encodeURIComponent(address);

    const L = await import('leaflet');

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then((data) => {
        if (!data || data.length === 0) return;
        const { lat, lon } = data[0];

        if (this.map) {
          this.map.remove();
        }

        this.map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker([lat, lon]).addTo(this.map)
          .bindPopup(flat.name ?? 'Mieszkanie')
          .openPopup();
      });
  }


  private selectPhotos() {
    this.flatPhotosUrls$ = this.store.select(getFlatPhotosUrlsSelector);
  }

  private selectFlat() {
    this.flat$ = this.store.select(getFlatSelector);
  }

  private selectIsLoggedIn(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedInSelector);
  }

  private subscribePhotos() {
    this.flatPhotosUrls$.subscribe(res => {
      this.flatPhotosUrls = res?.map(url => `${environment.apiUrlTmp}${url}`);
    });
  }

  private subscribeFlat() {
    this.flat$.subscribe(res => {
      this.flat = res;
      if(this.flat) {
        this.loadMap(this.flat);
      }
    });
  }


  private subscribeIsLoggedIn(): void {
    this.isLoggedIn$.subscribe(res => {this.isLoggedIn = res
      console.log(res);
    });
  }

  private dispatchPhotos() {
    if(this.flatId) {
      this.store.dispatch(FlatActions.getFlatPhotos({ id: this.flatId }));
    }
  }

  private dispatchFlat() {
    if(this.flatId) {
      this.store.dispatch(FlatActions.getFlat({ id: this.flatId }));
    }
  }
}
