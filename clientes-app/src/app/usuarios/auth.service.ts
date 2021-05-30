import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario = new Usuario;
  private _token:any;

  constructor(
    private http: HttpClient
    
  ) { }

  public get usuario():Usuario{
    
   /* if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario=JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      // let payload = JSON.parse(atob(sessionStorage.getItem('usuario'));
    //   const serializableState: string | any = sessionStorage.getItem('usuario') as Usuario;
    // return serializableState !== null || serializableState === undefined ? JSON.parse(serializableState) : undefined;
      
    // const user = sessionStorage.getItem('usuario');
      // this._usuario = user !== null ? JSON.parse(user):new Usuario;
      // return this._usuario =JSON.parse(sessionStorage.getItem('usuario')!);
      return this._usuario;
    }
    return new Usuario();*/
    if(sessionStorage.getItem('usuario') != null){
      this._usuario=JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();

  }

  public get token():any{
    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario:Usuario): Observable<any>{
    const url = 'http://localhost:8080/oauth/token';

    const credencial = btoa('angularapp'+':'+'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic '+ credencial});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password',usuario.password);
    console.log(params.toString());
    return this.http.post<any>(url,params.toString(),{headers:httpHeaders});
  }

  guardarUsuario(accessToken:string): void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario.nombre =payload.Nombre_Usuario;
    this._usuario.apellido =payload.Apellido_Usuario;
    this._usuario.email =payload.Email_Usuario;
    this._usuario.username =payload.user_name;
    this._usuario.roles =payload.authorities;

    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));


  }

  guardarToken(accessToken:string): void{
    this._token=accessToken;

    sessionStorage.setItem('token',accessToken);

  }

  obtenerDatosToken(accessToken: string): any{
    if(accessToken != null){

      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  logout():void{
    this._usuario = new Usuario();
    this._token = null;
    sessionStorage.clear();

    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('usuario');
  }

  hasRol(role:string):boolean {
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }
}
