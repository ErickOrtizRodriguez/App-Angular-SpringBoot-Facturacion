package com.project.spring.boot.backend.apirest.models.services;

import com.project.spring.boot.backend.apirest.models.entity.Cliente;
import com.project.spring.boot.backend.apirest.models.entity.Factura;
import com.project.spring.boot.backend.apirest.models.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IClienteService {
    public List<Cliente> findAll();

    public Page<Cliente> findAll(Pageable pageable);

    public Cliente findById(Long id);

    public Cliente save(Cliente cliente);

    public void delete(Long id);

    public List<Region> findAllRegiones();

    /*Factura Service*/
    public Factura findFacturasById(Long id);
    public Factura saveFactura(Factura factura);
    public void deleteFacturaById(Long id);
}
