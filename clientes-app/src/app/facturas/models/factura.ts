import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
     id:number=0;
     descripcion:string="";
     observacion:string="";
     items:ItemFactura[]=[];
     cliente: Cliente = new Cliente;
     total:number=0;
     createAt:string="";
}
