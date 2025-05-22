import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { commonImports, materialImports } from './core';
import { SideNavComponent } from "./core/side-nav-component/side-nav.component";
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { AuthActions, getIsLoggedInSelector, getTokenSelector } from './auth/store';

@Component({
  selector: 'app-root',
  imports: [...materialImports, RouterOutlet, SideNavComponent, ...commonImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Client';

  showSideNav = false;

  constructor(private router: Router, private store: Store<AppState>) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showSideNav = (event.url === '/login' || event.url === '/register' || event.url === '/forgot-password');
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.store.dispatch(AuthActions.setToken());
      }
    }
  }
}
