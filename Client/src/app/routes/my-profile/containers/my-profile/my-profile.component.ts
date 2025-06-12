import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { User } from '../../../../models/user';
import { Observable } from 'rxjs';
import { getUserSelector, UserActions } from '../../store';
import { commonImports, materialImports } from '../../../../core';
import { CommonModule } from '@angular/common';
import { FlatActions, getFlatsByOwnerIdSelector } from '../../../flats/store';
import { Flat } from '../../../../models/flat';
import { getFlatsByOwnerId } from '../../../flats/store/actions';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-my-profile',
  imports: [...materialImports, ...commonImports],
  templateUrl: './my-profile.component.html',
  styleUrls: ['../../../../../styles.scss', './my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user$!: Observable<User | undefined>;
  user!: User | undefined;
  ownerFlats$!: Observable<Flat[] | undefined>;
  ownerFlats!: Flat[] | undefined;
  
  constructor(private store: Store<AppState>, private router: Router) {
    this.selectUser();
    this.subscribeUser();
    this.selectOwnerFlats();
    this.subscribeOwnerFlats();
  }

  ngOnInit(): void {
    this.dispatchUser();
  }

  goToFlat(flat: Flat): void {
    this.router.navigate(['/flats/preview', flat?.id]);
  }

  mapPhoto(url: string | undefined) {
      return `${environment.apiUrlTmp}${url}`;
  }

  getFlatLocation(flat: any): string {
    const city = flat.city ? `${flat.city},` : '';
    const district = flat.district ? `${flat.district},` : '';
    const street = flat.street ? `${flat.street} st` : '';
    return [city, district, street].filter(part => part.trim()).join(' ');
  }

  private selectUser(): void {
    this.user$ = this.store.select(getUserSelector);
  }

  private selectOwnerFlats() {
    this.ownerFlats$ = this.store.select(getFlatsByOwnerIdSelector);
  }

  private subscribeUser(): void {
    this.user$.subscribe(user => {
      this.user = user
      if(this.user && this.user.id) {
        this.store.dispatch(FlatActions.getFlatsByOwnerId({ownerId: this.user.id}))
      }
    });
  }

  private subscribeOwnerFlats() {
    this.ownerFlats$.subscribe(res => {
      this.ownerFlats = res;
      console.log(res);
    });
  }

  private dispatchUser(): void {
    this.store.dispatch(UserActions.getMe());
  }
}
