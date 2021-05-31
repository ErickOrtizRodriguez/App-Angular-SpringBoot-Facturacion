import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private url = 'http://localhost:8080/api/facturas'


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  getFactura(id:number):Observable<Factura>{

    return this.http.get<Factura>(`${this.url}/${id}`);
  }
}