import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { materialImports } from './core';
import { SideNavComponent } from "./core/side-nav-component/side-nav.component";

@Component({
  selector: 'app-root',
  imports: [...materialImports, RouterOutlet, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Client';
}
