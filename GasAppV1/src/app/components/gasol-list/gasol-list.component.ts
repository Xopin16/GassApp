import { Component, OnInit } from '@angular/core';
import { ListaEESSPrecio } from 'src/app/models/interfaces/carburante.interface';
import { CarburanteService } from 'src/app/services/carburante.service';

@Component({
  selector: 'app-gasol-list',
  templateUrl: './gasol-list.component.html',
  styleUrls: ['./gasol-list.component.css'],
})
export class GasolListComponent implements OnInit {
  cityList: ListaEESSPrecio[] = [];

  constructor(private carburanteService: CarburanteService) {}

  ngOnInit(): void {
    this.carburanteService.getPrecios().subscribe((resp) => {
      this.cityList = resp.ListaEESSPrecio;
    });
  }
}
