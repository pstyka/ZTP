import { Component } from '@angular/core';
import { commonImports, materialImports } from '..';

@Component({
  selector: 'app-side-nav',
  imports: [...materialImports, ...commonImports],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  isOpen = true;

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }
}
