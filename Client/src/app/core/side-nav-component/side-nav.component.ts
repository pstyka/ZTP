import { Component, OnInit } from '@angular/core';
import { commonImports, materialImports } from '..';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { AuthActions, getIsLoggedInSelector } from '../../auth/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  imports: [...materialImports, ...commonImports],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  isOpen = true;
  isLoggedIn$!: Observable<boolean | undefined>;
  isLoggedIn!: boolean | undefined;

  constructor(private store: Store<AppState>, private router: Router) {
    this.selectIsLoggedIn();
    this.subscribeIsLoggedIn();
  }

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToAddListing() {
    this.router.navigate(['/flats/add'])
  }

  goToMyProfile() {
    this.router.navigate(['/myProfile']);
  }  

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.setItem('auth_token', "");
    this.store.dispatch(AuthActions.logout());
  }

  private selectIsLoggedIn(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedInSelector);
  }

  private subscribeIsLoggedIn(): void {
    this.isLoggedIn$.subscribe(res => this.isLoggedIn = res);
  }

}
