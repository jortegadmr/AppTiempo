import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    
    
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

export class WeatherComponent implements OnInit, AfterViewInit {

  //Variables
  city: string = 'Sevilla';   //Ciudad por defecto
  weatherData: any;           //Datos del clima
  loading: boolean = false;
  error: string | null = null;

  public esBrowser: boolean;

  constructor(private weatherService: WeatherService, @Inject(PLATFORM_ID) platformId: Object) {
    this.esBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.esBrowser) {
      this.getWeather(this.city);
    }
    
  }

  ngAfterViewInit() {
    if (this.weatherData) {
      this.loadChartData(this.weatherData);
    }
  }

  //Métodos para el gráfico
  
  chart: Chart | undefined;

  loadChartData(data: any) {
    console.log('Cargando datos del gráfico:', data);
    if (!data || !data.main) return;

    const temperature = data.main.temp;
    const cityName = data.name;

    this.renderChart(cityName, temperature);
  }

  renderChart(cityName: string, temperature: number) {
    console.log('Renderizando gráfico:', cityName, temperature);
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = document.getElementById('weatherChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [cityName],
        datasets: [{
          label: 'Temperatura actual (°C)',
          data: [temperature],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Temperatura (°C)'
            }
          }
        }
      }
    });
  }

  //Método para obtener los datos del clima

  getWeather(city: string) {
    this.loading = true;
    this.error = null;
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        console.log('Datos del clima recibidos:', data);
        this.weatherData = data;
        this.loadChartData(data);
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

  
}
