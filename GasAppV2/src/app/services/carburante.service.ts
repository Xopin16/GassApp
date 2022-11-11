import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarburanteResponse } from '../interfaces/carburante.interface';

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
