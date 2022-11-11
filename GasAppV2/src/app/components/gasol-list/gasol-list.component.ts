import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ListaEESSPrecio } from 'src/app/interfaces/carburante.interface';
import { CarburanteService } from 'src/app/services/carburante.service';

@Component({
  selector: 'app-gasol-list',
  templateUrl: './gasol-list.component.html',
  styleUrls: ['./gasol-list.component.css']
})
export class GasolListComponent implements OnInit {

  gasolList: ListaEESSPrecio[] = [];
  gasolFilteredList: ListaEESSPrecio[] = [];
  carburantesList = ['Gasoleo', 'Gasolina', 'Hidrogeno'];
  carburanteSelected = 'Gasoleo';
  precioMin = 1;
  valor: number = 3;
  precioMax = 5;

  constructor(private carburanteService: CarburanteService) { }

  ngOnInit() {
    this.carburanteService.getPrecios().subscribe((resp) => {
      this.gasolList = resp.ListaEESSPrecio;
      this.gasolFilteredList = resp.ListaEESSPrecio;
    });
  }

  filtrar(precio: number){
    this.gasolFilteredList = this.gasolList.filter(x => this.filtro(precio, x));
  }

  filtro(precio: number, x: ListaEESSPrecio): boolean {
    let pasaFiltro = false;
    if(this.carburanteSelected == 'Gasoleo') {
      pasaFiltro = +x['Precio Gasoleo A'].replace(",",".") < precio ? true: false;
    } else if(this.carburanteSelected == 'Gasolina') {
      pasaFiltro = +x['Precio Gasolina 95 E5'].replace(",",".") > precio ? true: false;
    } else{
      pasaFiltro = +x['Precio Hidrogeno'].replace(",",".") > precio ? true: false;
    }
    return pasaFiltro;
  }
  
  changeSelected(event: MatSliderChange){
    event.value
  }

}

