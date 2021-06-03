import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, mergeMap, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
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

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(
    private clienteService:ClienteService,
    private activatedRoute:ActivatedRoute,
    private facturaService:FacturasService,
    private router:Router
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

    if(this.existeItems(productoSelected.id)){
      this.incrementaCantidad(productoSelected.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = productoSelected;
      this.factura.items.push(nuevoItem); 
    }

    this.myControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizaCantidad(id:number,event:any): void{
    let cantidad:number = event.target.value as number;
    if(cantidad == 0){
     return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItems(id:number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) =>{
      if(id === item.producto.id){
        existe=true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }

eliminarItemFactura(id:number):void{
  this.factura.items = this.factura.items.filter((item: ItemFactura)=> id !== item.producto.id);
}

/* metodo crear sin validacion
crearFactura():void {
  console.log("Factura creada",this.factura);
  this.facturaService.crearFactura(this.factura).subscribe(factura =>{
    this.Toast.fire({
      icon: 'success',
      title:  `Factura Creada Correctamente!`
    })
    this.router.navigate(['/clientes']);
  });
}*/
crearFactura(facturaForm: any):void {
  console.log("Factura creada",this.factura);
  if(this.factura.items.length ==0){
    this.myControl.setErrors({'invalid': true});
  }
  if(facturaForm.form.valid && this.factura.items.length >0){
    this.facturaService.crearFactura(this.factura).subscribe(factura =>{
      this.Toast.fire({
        icon: 'success',
        title:  `Factura Creada Correctamente!`
      })
      this.router.navigate(['/clientes']);
    });
  }
 
}

}
