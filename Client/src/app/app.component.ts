import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { commonImports, materialImports } from './core';
import { SideNavComponent } from "./core/side-nav-component/side-nav.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [...materialImports, RouterOutlet, SideNavComponent, ...commonImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Client';

  showSideNav = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showSideNav = (event.url === '/login' || event.url === '/register' || event.url === '/forgot-password');
    });
  }
}
