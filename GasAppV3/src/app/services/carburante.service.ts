import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarburanteResponse } from '../interfaces/carburante.interface';
import { MunicipioResponse } from '../interfaces/municipio.interface';
import { ProvinciaResponse } from '../interfaces/provincia.interface';

@Injectable({
  providedIn: 'root',
})
export class CarburanteService {
  constructor(private http: HttpClient) {}

  getPrecios(): Observable<CarburanteResponse> {
    return this.http.get<CarburanteResponse>(
      `https://raw.githubusercontent.com/Xopin16/GassV1/main/carburante.json`
    );
  }

  getProvincias(): Observable<ProvinciaResponse[]> {
    return this.http.get<ProvinciaResponse[]>(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/`
    );
  }

  getMunicipios(id: String): Observable<MunicipioResponse[]> {
    return this.http.get<MunicipioResponse[]>(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${id}`
    );
  }
}
