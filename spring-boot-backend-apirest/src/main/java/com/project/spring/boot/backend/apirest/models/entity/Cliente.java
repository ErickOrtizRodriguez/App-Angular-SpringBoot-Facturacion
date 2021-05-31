package com.project.spring.boot.backend.apirest.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="clientes")
public class Cliente implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY  )
    private long id;


    @NotNull(message ="no puede estar vacio")
    @Size(min=4, max=12, message="el tamaño tiene que estar entre 4 y 12")
    @Column(nullable=false)
    private String nombre;


    @NotNull(message ="no puede estar vacio")
    private String apellido;


    @NotNull(message ="no puede estar vacio")
    @Email(message="no es una dirección de correo bien formada")
    @Column(nullable=false, unique=true)
    private String email;

    @Column(name="create_at")
    @NotNull(message ="no puede estar vacio")
    @Temporal(TemporalType.DATE)
    private Date createAt;


    private  String foto;

    @NotNull(message = "La region no puede estar vacio")
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "region_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ignorar las propiedas que por defecto tra el metodo lazy
    private Region region;

//    metodo para ingresar la fecha de forma automatica
//    @PrePersist
//    public void prePersist(){
//        createAt = new Date();
//    }
    @JsonIgnoreProperties({"clientes","hibernateLazyInitializer", "handler"})
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "cliente",cascade = CascadeType.ALL)
    private List<Factura> facturas;

    public Cliente() {
        this.facturas = new ArrayList<>();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    private static final long serialVersionUID = 1L;

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public List<Factura> getFacturas() {
        return facturas;
    }

    public void setFacturas(List<Factura> facturas) {
        this.facturas = facturas;
    }
}
