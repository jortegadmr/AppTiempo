import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

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
  styleUrls: ['./weather.component.scss']
})

export class WeatherComponent implements OnInit {

  //Variables
  city: string = 'Sevilla';   //Ciudad por defecto
  weatherData: any;           //Datos del clima
  loading: boolean = false;
  error: string | null = null;

  //Configuración del gráfico

  public lineChartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    datasets: [{ data: [20, 22, 21, 19, 18], label: 'Temperatura' }]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  
  public lineChartLegend = true;

  //Inyección de dependencias
  //El constructor es un método que se ejecuta cuando se crea una instancia de la clase

  public esBrowser: boolean;

  constructor(private weatherService: WeatherService, @Inject(PLATFORM_ID) platformId: Object) {
    this.esBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.esBrowser) {
      this.getWeather(this.city);
    }
  }

  //Método para obtener los datos del clima

  getWeather(city: string) {
    this.loading = true;
    this.error = null;
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        console.log(data);
        this.weatherData = data;
        this.updateChartData(data);
      },
      error: (error) => {
        console.error('Error al obtener datos del clima:', error);
        this.error = 'No se pudo obtener la información del clima. Por favor, intenta de nuevo.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private updateChartData(data: any) {
    // Aquí puedes actualizar los datos del gráfico basándote en la respuesta de la API
    // Por ejemplo:
    this.lineChartData.datasets[0].data = [data.main.temp];
    this.lineChartData.labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  }
}
