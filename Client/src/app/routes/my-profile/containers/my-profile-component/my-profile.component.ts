import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { User } from '../../../../models/user';
import { Observable } from 'rxjs';
import { getUserSelector, UserActions } from '../../store';
import { materialImports } from '../../../../core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [...materialImports, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['../../../../../styles.scss', './my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user$!: Observable<User | undefined>;
  user!: User | undefined
  
  constructor(private store: Store<AppState>) {
    this.selectUser();
    this.subscribeUser();
  }

  ngOnInit(): void {
    this.dispatchUser();
  }

  private selectUser(): void {
    this.user$ = this.store.select(getUserSelector);
  }

  private subscribeUser(): void {
    this.user$.subscribe(user => this.user = user);
  }

  private dispatchUser(): void {
    this.store.dispatch(UserActions.getMe());
  }
}
