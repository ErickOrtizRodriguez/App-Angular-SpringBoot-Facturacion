package com.project.spring.boot.backend.apirest.controllers;


import com.project.spring.boot.backend.apirest.models.entity.Factura;
import com.project.spring.boot.backend.apirest.models.services.IClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api" )
public class FacturaRestController {
    @Autowired
    private IClienteService clienteService;

    @GetMapping("/facturas/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Factura VerFactura(@PathVariable Long id){
        return clienteService.findFacturasById(id);
    }

}