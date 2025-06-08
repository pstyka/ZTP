import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ActivatedRoute } from '@angular/router';
import { FlatActions, getFlatPhotosUrlsSelector } from '../../store';
import { Observable } from 'rxjs';
import { commonImports, materialImports } from '../../../../core';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-flat-preview',
  imports: [...commonImports, ...materialImports],
  templateUrl: './flat-preview.component.html',
  styleUrl: './flat-preview.component.scss'
})
export class FlatPreviewComponent implements OnInit {
  flatId!: string;
  flatPhotosUrls$!: Observable<string[] | undefined>;
  flatPhotosUrls!: string[] | undefined;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.selectPhotos();
    this.subscribePhotos();
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id')!;
    this.dispatchPhotos();
  }

  private selectPhotos() {
    this.flatPhotosUrls$ = this.store.select(getFlatPhotosUrlsSelector);
  }

  private subscribePhotos() {
    this.flatPhotosUrls$.subscribe(res => {
      this.flatPhotosUrls = res?.map(url => `${environment.apiUrlTmp}${url}`);
    });
  }

  private dispatchPhotos() {
    if(this.flatId) {
      this.store.dispatch(FlatActions.getFlatPhotos({ id: this.flatId }));
    }
  }
}
