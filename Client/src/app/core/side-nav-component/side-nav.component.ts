import { Component } from '@angular/core';
import { commonImports, materialImports } from '..';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [...materialImports, ...commonImports],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  isOpen = true;

  constructor(private router: Router) {}

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
