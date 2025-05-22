import { Component } from '@angular/core';
import { materialImports } from '../../../../core';

@Component({
  selector: 'app-home',
  imports: [...materialImports],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
