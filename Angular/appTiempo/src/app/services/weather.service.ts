import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'eaff42740a029961c0d0d41487de06c5';
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  private getUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  private getParams(city: string, additionalParams: {} = {}): HttpParams {
    return new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .appendAll(additionalParams);
  }

  getWeather(city: string): Observable<any> {
    return this.http.get(this.getUrl('weather'), { params: this.getParams(city) });
  }

  getForecast(city: string, days: number = 7): Observable<any> {
    return this.http.get(this.getUrl('forecast'), { params: this.getParams(city, { cnt: days.toString() }) });
  }

  getHistoricalData(city: string, date: string): Observable<any> {
    return this.http.get(this.getUrl('onecall/timemachine'), { params: this.getParams(city, { dt: date }) });
  }

  getAirPollution(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey);
    return this.http.get(this.getUrl('air_pollution'), { params });
  }

  getUVIndex(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey);
    return this.http.get(this.getUrl('uvi'), { params });
  }

  searchCities(query: string): Observable<string[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', '5')
      .set('appid', this.apiKey);
    return this.http.get<any[]>(this.getUrl('find'), { params })
      .pipe(map(response => response.map(city => city.name)));
  }
}
