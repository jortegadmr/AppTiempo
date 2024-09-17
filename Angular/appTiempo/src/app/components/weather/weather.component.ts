import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Chart , ChartConfiguration, ChartData, ChartOptions} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    BaseChartDirective
  ],

  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(500)),
    ])
  ],

  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})

export class WeatherComponent {

  //Variables
  city: string = 'Seville';   //Ciudad por defecto
  weatherData: any;           //Datos del clima

  //Configuración del gráfico

  public lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ data: [20, 22, 21, 19, 18], label: 'Temperature' }]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  
  public lineChartLegend = true;

  //Inyección de dependencias
  //El constructor es un método que se ejecuta cuando se crea una instancia de la clase

  constructor(private weatherService: WeatherService) { }

  //Método para obtener los datos del clima

  loading: boolean = false;

  getWeather(city: string) {
    this.loading = true;
    this.weatherService.getWeather(city).subscribe((data) => {
      console.log(data);
      this.weatherData = data;
      this.loading = false;
    },

    //Manejo de errores
    //El error es un objeto que contiene información sobre el error
    (error) => {
      console.error('Error fetching weather data:', error);
      this.loading = false;
    }
  );
  }
}
