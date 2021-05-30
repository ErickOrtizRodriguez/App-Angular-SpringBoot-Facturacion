import { createHostListener } from '@angular/compiler/src/core';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector:'app-header',
  templateUrl:'./header.component.html'
})
export class HeaderComponent implements OnInit{
title:string = 'Angula&SpringBoot';
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
    public authService:AuthService,
    private router:Router
    ){}
  
  ngOnInit(): void {
    console.log(this.authService.usuario);
  }

  cerrarSesion():void {
    let username =this.authService.usuario.username;
    this.authService.logout();
    this.Toast.fire({
      icon: 'success',
      title: `Usuario ${username} a Cerrado Sesión Correctamente`
    })
    this.router.navigate(['/login']);
  }

}
