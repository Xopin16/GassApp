import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarburanteResponse } from '../models/interfaces/carburante.interface';

@Injectable({
  providedIn: 'root'
})
export class CarburanteService {

  constructor(private http: HttpClient) { }

  getPrecios(): Observable<CarburanteResponse> {
    return this.http.get<CarburanteResponse>(
      `https://raw.githubusercontent.com/Xopin16/GassV1/main/carburante.json`
    );
  }
}
