import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ListaEESSPrecio } from 'src/app/interfaces/carburante.interface';
import { MunicipioResponse } from 'src/app/interfaces/municipio.interface';
import { ProvinciaResponse } from 'src/app/interfaces/provincia.interface';
import { CarburanteService } from 'src/app/services/carburante.service';

@Component({
  selector: 'app-gasol-list',
  templateUrl: './gasol-list.component.html',
  styleUrls: ['./gasol-list.component.css'],
})
export class GasolListComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions?: Observable<string[]>;
  gasolList: ListaEESSPrecio[] = [];
  gasolFilteredList: ListaEESSPrecio[] = [];
  provinciasList: ProvinciaResponse[] = [];
  munList: MunicipioResponse[] = [];
  carburantesList = ['Gasoleo', 'Gasolina', 'Hidrogeno'];
  carburanteSelected = 'Gasoleo';
  precioMin = 1;
  provinciaSelected: String[] = [];
  municipioSelected = '';
  munSel: string[] = [];
  valor: number = 3;
  precioMax = 5;
  center: google.maps.LatLngLiteral = { lat: 40, lng: -4 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  gasolSelected: ListaEESSPrecio = {} as ListaEESSPrecio;

  constructor(private carburanteService: CarburanteService) {}

  ngOnInit() {
    this.carburanteService.getPrecios().subscribe((resp) => {
      this.gasolList = resp.ListaEESSPrecio;
      this.gasolFilteredList = resp.ListaEESSPrecio;
    });

    this.carburanteService.getProvincias().subscribe((resp) => {
      this.provinciasList = resp;
    });
  }

  // openInfoWindow(marker: MapMarker) {
  //   this.infoWindow.open(marker);
  // }

  openInfoWindow(marker: MapMarker, station: ListaEESSPrecio) {
    this.gasolSelected = station;
    this.infoWindow.open(marker);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  filtrar() {
    this.options = [];
    this.gasolFilteredList = this.gasolList.filter(x => this.filtro(x));
    this.rellenarListaGas();
  }

  rellenarListaGas() {
    this.gasolFilteredList.forEach((x) =>
      this.markerPositions.push({
        lat: +x.Latitud.replace(',', '.'),
        lng: +x['Longitud (WGS84)'].replace(',', '.'),
      })
    );
  }

  getLat(lng: string) {
    return +lng.replace(',', '.');
  }

  getLng(lat: string) {
    return +lat.replace(',', '.');
  }

  filtro(x: ListaEESSPrecio): boolean {
    this.markerPositions = [];
    this.rellenarListaGas();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    for (let it of this.gasolFilteredList) {
      if (!this.options.includes(it['Municipio'])) {
        this.options.push(it['Municipio']);
      }
    }
    let pasaFiltro = false;
    if(this.carburanteSelected == 'Gasoleo') {
      pasaFiltro = +x['Precio Gasoleo A'].replace(",",".") < this.precioMax && (this.provinciaSelected.includes(x['IDProvincia']) || this.provinciaSelected.length == 0) ? true: false;
    } else if(this.carburanteSelected == 'Gasolina') {
      pasaFiltro = +x['Precio Gasolina 95 E5'].replace(",",".") < this.precioMax && (this.provinciaSelected.includes(x['IDProvincia']) || this.provinciaSelected.length == 0) ? true: false;
    } else{
      pasaFiltro = +x['Precio Hidrogeno'].replace(",",".") < this.precioMax &&  (this.provinciaSelected.includes(x['IDProvincia']) || this.provinciaSelected.length == 0)? true: false;
    }
    return pasaFiltro;
  }
}
