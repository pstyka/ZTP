import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ActivatedRoute } from '@angular/router';
import { FlatActions, getFlatPhotosUrlsSelector, getFlatSelector } from '../../store';
import { Observable } from 'rxjs';
import { commonImports, materialImports } from '../../../../core';
import { environment } from '../../../../../environment';
import { Flat } from '../../../../models/flat';

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

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.selectPhotos();
    this.selectFlat();
    this.subscribePhotos();
    this.subscribeFlat();
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id')!;
    this.dispatchPhotos();
    this.dispatchFlat();
  }

  private selectPhotos() {
    this.flatPhotosUrls$ = this.store.select(getFlatPhotosUrlsSelector);
  }

  private selectFlat() {
    this.flat$ = this.store.select(getFlatSelector);
  }

  private subscribePhotos() {
    this.flatPhotosUrls$.subscribe(res => {
      this.flatPhotosUrls = res?.map(url => `${environment.apiUrlTmp}${url}`);
    });
  }

  private subscribeFlat() {
    this.flat$.subscribe(res => {
      this.flat = res;
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
