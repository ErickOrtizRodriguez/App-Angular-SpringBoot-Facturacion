import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;

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
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
   }
   

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.Toast.fire({
        icon: 'info',
        title: `Usuario ${this.authService.usuario.username} ya esta Autenticado`
      });
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log("usuario",this.usuario);
    if(this.usuario.username == ""  || this.usuario.password == ""){
      this.Toast.fire({
        icon: 'error',
        title: `Usuario o Contraseña estan Vacios`
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(response =>{
      console.log(response);
      this.router.navigate(['/clientes']);
      let payload = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log("Datos payloa",payload);
      this.authService.guardarUsuario(response.access_token);
      console.log("guardarusuario",response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuari = this.authService.usuario;
      console.log(usuari);

      this.Toast.fire({
        icon: 'success',
        title: `Bienvenido ${payload.user_name}`
      });
    },err =>{
      if(err.status == 400){
        this.Toast.fire({
          icon: 'error',
          title: `Usuario o Password Incorrectos`
        });
      }
    }
    );
  }

}
