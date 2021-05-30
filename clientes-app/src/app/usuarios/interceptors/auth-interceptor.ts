import {Injectable, InjectionToken} from '@angular/core';
import {Observable,throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';

import {
    HttpEvent,
    HttpHandler,HttpInterceptor,HttpRequest
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
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
        private authService:AuthService,
        private router:Router
    
      ){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
    return next.handle(req).pipe(
      catchError (e=>{
        if(e.status==401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
    
        if( e.status == 403){
          this.Toast.fire({
            icon: 'warning',
            title: `${this.authService.usuario.username} No Estas Autorizado`
          })
          this.router.navigate(['/clientes']);
        
        }
        return throwError(e);
      })
    );
  }
}