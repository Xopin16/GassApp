import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ListaEESSPrecio } from 'src/app/interfaces/carburante.interface';
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
  options: string[] = []
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

  constructor(private carburanteService: CarburanteService) { }

  ngOnInit() {
    this.carburanteService.getPrecios().subscribe((resp) => {
      this.gasolList = resp.ListaEESSPrecio;
      this.gasolFilteredList = resp.ListaEESSPrecio;
    });

    this.carburanteService.getProvincias().subscribe((resp) =>{
      this.provinciasList = resp;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filtrar(){
    this.options = [];
    // if(this.provinciaSelected.length != 0){
      this.gasolFilteredList = this.gasolList.filter(x => this.filtro(x));
    // }else {
    //   this.gasolFilteredList = this.gasolList;
    // }
  }

  filtro(x: ListaEESSPrecio): boolean {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    
    for (let it of this.gasolFilteredList) {
      if(!this.options.includes(it['Municipio'])){
        this.options.push(it['Municipio'])
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

