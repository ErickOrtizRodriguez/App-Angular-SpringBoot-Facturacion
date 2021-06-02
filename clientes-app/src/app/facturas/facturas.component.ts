import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  titulo ="Nueva Factura";
  factura:Factura= new Factura();

  myControl = new FormControl();
  productos: string[] = ['Tablet', 'Iphone', 'Phone','TV','Watch'];
  productosFiltrados!: Observable<string[]>;

  constructor(
    private clienteService:ClienteService,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId:any = params.get("clienteId");
        this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      
    });

    this.productosFiltrados = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(productos => productos.toLowerCase().includes(filterValue));
  }

}
