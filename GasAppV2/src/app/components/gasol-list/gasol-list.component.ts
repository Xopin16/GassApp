import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CarburanteResponse, ListaEESSPrecio } from 'src/app/interfaces/carburante.interface';
import { MunicipioResponse } from 'src/app/interfaces/municipio.interface';
import { ProvinciaResponse } from 'src/app/interfaces/provincia.interface';
import { CarburanteService } from 'src/app/services/carburante.service';

@Component({
  selector: 'app-gasol-list',
  templateUrl: './gasol-list.component.html',
  styleUrls: ['./gasol-list.component.css']
})
export class GasolListComponent implements OnInit {

  myControl = new FormControl('');
  filteredOptions?: Observable<MunicipioResponse[]>;
  gasolList: ListaEESSPrecio[] = [];
  gasolFilteredList: ListaEESSPrecio[] = [];
  provinciasList: ProvinciaResponse[] = [];
  provinciaFilter: ProvinciaResponse[] = [];
  munList: MunicipioResponse[] = [];
  carburantesList = ['Gasoleo', 'Gasolina', 'Hidrogeno'];
  carburanteSelected = 'Gasoleo';
  precioMin = 1;
  provinciaSelected: String[] = [];
  municipioSelected = '';
  munSel: string[] = [];
  valor: number = 3;
  precioMax = 5;

  constructor(private carburanteService: CarburanteService) { }

  ngOnInit() {
    this.carburanteService.getPrecios().subscribe((resp) => {
      this.gasolList = resp.ListaEESSPrecio;
      this.gasolFilteredList = resp.ListaEESSPrecio;
    });

    this.carburanteService.getProvincias().subscribe((resp) =>{
      this.provinciasList = resp;
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  private _filter(value: string): MunicipioResponse[] {
    const filterValue = value.toLowerCase();

    return this.munList.filter(option => option.Municipio.toLowerCase().includes(filterValue));
  }

  displayFn(m: MunicipioResponse): string {
    return m.Municipio;
  }

  filtrar(){
    this.gasolFilteredList = this.gasolList.filter(x => this.filtro(x));
  }

  filtro(x: ListaEESSPrecio): boolean {
    let pasaFiltro = false;
    if(this.carburanteSelected == 'Gasoleo') {
      pasaFiltro = +x['Precio Gasoleo A'].replace(",",".") < this.precioMax &&  this.provinciaSelected.includes(x['IDProvincia'])? true: false;
      this.filtrarMunicipios(this.gasolFilteredList);
    } else if(this.carburanteSelected == 'Gasolina') {
      pasaFiltro = +x['Precio Gasolina 95 E5'].replace(",",".") < this.precioMax && this.provinciaSelected.includes(x['IDProvincia']) ? true: false;
      this.filtrarMunicipios(this.gasolFilteredList);
    } else{
      pasaFiltro = +x['Precio Hidrogeno'].replace(",",".") < this.precioMax &&  this.provinciaSelected.includes(x['IDProvincia'])? true: false;
      this.filtrarMunicipios(this.gasolFilteredList);
    }
    return pasaFiltro;
  }

  filtrarMunicipios(gasol: ListaEESSPrecio[]) {
    this.gasolFilteredList = gasol.filter(x => x.IDMunicipio == this.municipioSelected);
  }
  
  getMunicipios(){
    this.munList = [];
    this.provinciaSelected.forEach(x => this.carburanteService.getMunicipios(x).subscribe((resp) => {
      this.munList = this.munList.concat(resp);
    }))
  }
}

