package com.project.spring.boot.backend.apirest.controllers;


import com.project.spring.boot.backend.apirest.models.entity.Factura;
import com.project.spring.boot.backend.apirest.models.entity.Producto;
import com.project.spring.boot.backend.apirest.models.services.IClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/facturas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFactura(@PathVariable Long id){
        clienteService.deleteFacturaById(id);
    }

    @GetMapping("/facturas/filtrar-productos/{term}")
    @ResponseStatus(HttpStatus.OK)
    public List<Producto> filtrarProductos(@PathVariable String term){
        return clienteService.findProductoByNombre(term);
    }
}
