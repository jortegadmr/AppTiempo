import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    BaseChartDirective
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'appTiempo';
}
