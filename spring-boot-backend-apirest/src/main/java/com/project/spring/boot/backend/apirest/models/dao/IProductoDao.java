package com.project.spring.boot.backend.apirest.models.dao;

import com.project.spring.boot.backend.apirest.models.entity.Producto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface IProductoDao extends CrudRepository<Producto, Long> {
    @Query("select p from Producto p where p.nombre like %?1%")
    public List<Producto> findByNombre(String term);

    /* nombre de metodo con palabras reservadas containing Busca el carater en cualquier parte de la cadena*/
    public List<Producto> findByNombreContainingIgnoreCase(String term);

    /*busca el caracter al principio de la cadena*/
//    public List<Producto> findByNombreStartingIgnoreCase(String term);


}
