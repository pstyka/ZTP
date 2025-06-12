import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { User } from '../../../../models/user';
import { Observable } from 'rxjs';
import { getUserSelector, UserActions } from '../../store';
import { materialImports } from '../../../../core';
import { CommonModule } from '@angular/common';
import { FlatActions, getFlatsByOwnerIdSelector } from '../../../flats/store';
import { Flat } from '../../../../models/flat';
import { getFlatsByOwnerId } from '../../../flats/store/actions';

@Component({
  selector: 'app-my-profile',
  imports: [...materialImports, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['../../../../../styles.scss', './my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user$!: Observable<User | undefined>;
  user!: User | undefined;
  ownerFlats$!: Observable<Flat[] | undefined>;
  ownerFlats!: Flat[] | undefined;
  
  constructor(private store: Store<AppState>) {
    this.selectUser();
    this.subscribeUser();
    this.selectOwnerFlats();
    this.subscribeOwnerFlats();
  }

  ngOnInit(): void {
    this.dispatchUser();
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
    });
  }

  private dispatchUser(): void {
    this.store.dispatch(UserActions.getMe());
  }
}
