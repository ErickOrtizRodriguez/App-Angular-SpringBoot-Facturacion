import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { EMPTY, empty } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente:any = Cliente;
  public fotoSelecionada!: File;
  progreso:number =0;

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
  clienteSeleccionado: Cliente = new Cliente;
  modal:boolean = false;
  

  constructor(
    private clienteService:ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    public authService:AuthService,
    public facturaService:FacturasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let id:any = params.get("id");
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event:any){
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSelecionada);
    if(this.fotoSelecionada.type.indexOf('image')< 0){
      this.Toast.fire({
        icon: 'error',
        title:  `Debe Seleccionar una Imagen`
      })
      this.fotoSelecionada = event.files; 

    }
  }

  subirFoto(){

    if(!this.fotoSelecionada){
      this.Toast.fire({
        icon: 'error',
        title:  `Debe Seleccionar una Imagen`
      })
    }else{
    this.clienteService.subirFoto(this.fotoSelecionada, this.cliente.id)
    .subscribe(event =>{
      if(event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round(100 * event.loaded / (event.total ?? 0));
        console.log("el progreso",this.progreso);
      }else if(event.type === HttpEventType.Response){
        let response:any = event.body;
        this.cliente = response.cliente as Cliente;

        this.modalService.notificarUpload.emit(this.cliente);
        this.Toast.fire({
          icon: 'success',
          title:  `Foto Subida Correctamente`
        })
      }
     
    });
  }
  }

  // Metodo subir imagen antes de barra de progreso
  // subirFoto(){

  //   if(!this.fotoSelecionada){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title:  `Debe Seleccionar una Imagen`
  //     })
  //   }else{
  //   this.clienteService.subirFoto(this.fotoSelecionada, this.cliente.id)
  //   .subscribe(cliente =>{
  //     this.cliente = cliente;
  //     this.Toast.fire({
  //       icon: 'success',
  //       title:  `Foto Subida Correctamente`
  //     })
  //   });
  // }
  // }

  // abrirModal(cliente:Cliente){
  //   this.modal=true;
  //   this.clienteSeleccionado = cliente;
  // }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.modal=false;
    this.fotoSelecionada!;
    this.progreso=0;

  }

  deleteFactura(factura: Factura){
    Swal.fire({
      title: 'Esta Seguro?',
      text: `Seguro que desea eliminar la Factura del cliente! ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.deleteFactura(factura.id).subscribe(
          data =>{
            this.cliente.facturas = this.cliente.facturas.filter((f: Factura) => f !== factura)
            this.Toast.fire({
              icon: 'success',
              title:  `Factura ${factura.descripcion} Eliminada Correctamente.!`
            })

          });
      }
    })
  }

}
