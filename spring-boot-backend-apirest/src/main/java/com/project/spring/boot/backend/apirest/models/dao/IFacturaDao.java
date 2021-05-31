package com.project.spring.boot.backend.apirest.models.dao;

import com.project.spring.boot.backend.apirest.models.entity.Factura;
import org.springframework.data.repository.CrudRepository;

public interface IFacturaDao extends CrudRepository<Factura,Long> {

}
