import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { materialImports } from './core';

@Component({
  selector: 'app-root',
  imports: [...materialImports, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Client';
}
