import {Injectable, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {
    HttpEvent,
    HttpHandler,HttpInterceptor,HttpRequest
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    
    constructor(
        private authService:AuthService,
        private router:Router
    
      ){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let token = this.authService.token;
      if(token != null){
        const authReq = req.clone({
            headers: req.headers.set('Authorization','Bearer ' +token)
          });

    return next.handle(authReq);

      }
    return next.handle(req);
  }
}