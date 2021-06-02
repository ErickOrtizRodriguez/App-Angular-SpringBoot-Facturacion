import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, mergeMap, startWith } from 'rxjs/operators';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturasService } from './services/facturas.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  titulo ="Nueva Factura";
  factura:Factura= new Factura();

  myControl = new FormControl();
  productosFiltrados!: Observable<Producto[]>;

  constructor(
    private clienteService:ClienteService,
    private activatedRoute:ActivatedRoute,
    private facturaService:FacturasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId:any = params.get("clienteId");
        this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      
    });

    this.productosFiltrados = this.myControl.valueChanges
      .pipe(
        map( value => typeof value === 'string'? value: value.nombre),
        mergeMap(value => value ? this._filter(value):[])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto:Producto):any|[]{
    return producto? producto.nombre:[];

  }

  productoSeleccionado(event: MatAutocompleteSelectedEvent): void{
    let productoSelected = event.option.value as Producto;
    console.log(productoSelected);

    let nuevoItem = new ItemFactura();
    nuevoItem.producto = productoSelected;
    this.factura.items.push(nuevoItem); 

    this.myControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizaCantidad(id:number,event:any): void{
    let cantidad:number = event.target.value as number;

    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

}
