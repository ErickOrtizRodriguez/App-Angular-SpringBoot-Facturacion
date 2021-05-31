import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {
  id:number=0;
  nombre:string='';
  email:string='';
  apellido:string='';
  createAt:string='';
  region: Region | undefined;
  factura:Factura[]=[];
}
