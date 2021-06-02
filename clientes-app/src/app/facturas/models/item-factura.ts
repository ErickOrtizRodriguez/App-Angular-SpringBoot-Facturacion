import { Producto } from "./producto";

export class ItemFactura {
    producto: Producto = new Producto;
    cantidad: number=1;
    importe:number=0;

    public calcularImporte():number{
        return this.cantidad*this.producto.precio;
    }
}
