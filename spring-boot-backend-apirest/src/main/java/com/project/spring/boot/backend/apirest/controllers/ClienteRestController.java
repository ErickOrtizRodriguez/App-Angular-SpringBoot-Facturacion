package com.project.spring.boot.backend.apirest.controllers;

import com.project.spring.boot.backend.apirest.models.entity.Cliente;
import com.project.spring.boot.backend.apirest.models.entity.Region;
import com.project.spring.boot.backend.apirest.models.services.IClienteService;
import com.project.spring.boot.backend.apirest.models.services.IUploadFileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api" )
public class ClienteRestController {

    @Autowired
    private IClienteService clienteService;

    @Autowired
    private IUploadFileService uploadFileService;

    private final Logger log = LoggerFactory.getLogger(ClienteRestController.class);

    @GetMapping("/clientes")
    public List<Cliente> index(){
        return clienteService.findAll();

    }

    @GetMapping("/clientes/page/{page}")
    public Page<Cliente> index(@PathVariable Integer page){
        Pageable pageable = PageRequest.of(page,5);
        return clienteService.findAll(pageable);

    }

//    @Secured({"ROLE_USER","ROLE_ADMIN"})
    @GetMapping("/clientes/{id}")
    public ResponseEntity<?> show(@PathVariable Long id){
        Cliente cliente = null;
        Map<String, Object> response = new HashMap<>();

        try{
            cliente = clienteService.findById(id);
        }catch (DataAccessException e){
            response.put("mensaje","Error al realizar la Consulta en la base de datos");
            response.put("error",e.getMessage().concat(":").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);

        }
        if(cliente == null){
            response.put("mensaje", "El cliente ID: ".concat(id.toString().concat(" No existe en la base de datos")));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
//        return clienteService.findById(id);
    }

//    metodo crear sin Manejo de errores
//    @PostMapping("/clientes")
//    @ResponseStatus(HttpStatus.CREATED)
//    public Cliente create(@RequestBody Cliente cliente){
//        return clienteService.save(cliente);
//    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/clientes")
    public ResponseEntity<?> create(@RequestBody @Valid Cliente cliente, BindingResult result){

        Cliente clienteNew = null;
        Map<String, Object> response = new HashMap<>();
        if (result.hasErrors()) {
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

//        if(result.hasErrors()) {
//
//            List<String> errors = result.getFieldErrors()
//                    .stream()
//                    .map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
//                    .collect(Collectors.toList());
//
//            response.put("errors", errors);
//            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
//        }

        
        try{
            clienteNew = clienteService.save(cliente);
        }catch (DataAccessException e){
            response.put("mensaje","Error al realizar el Insert en la base de datos");
            response.put("error",e.getMessage().concat(":").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);

        }
        response.put("mensaje","Registro creado Correctamente");
        response.put("cliente", clienteNew);
        return new ResponseEntity<Map<String, Object>>(response,HttpStatus.CREATED);
    }



//    Metodo Update sin manejo de errores

//    @PutMapping("clientes/{id}")
//    @ResponseStatus(HttpStatus.CREATED)
//    public Cliente update(@RequestBody Cliente cliente, @PathVariable Long id){
//        Cliente clienteActual = clienteService.findById(id);
//
//
//        clienteActual.setNombre(cliente.getNombre());
//        clienteActual.setApellido(cliente.getApellido());
//        clienteActual.setEmail(cliente.getEmail());
//
//        return clienteService.save(clienteActual);
//    }

//    Metodo Update con manejo de errores.
    @Secured("ROLE_ADMIN")
    @PutMapping("clientes/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody Cliente cliente, BindingResult result, @PathVariable Long id){

        Cliente clienteActual = clienteService.findById(id);
        Cliente clienteUpdates=null;
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()){
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El Campo '"+ err.getField() +"' "+ err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);

        }

        if(clienteActual == null){
            response.put("mensaje:", "Error El cliente ID: ".concat(id.toString().concat(" No existe en la base de datos")));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.NOT_FOUND);
        }

        try{
            clienteActual.setNombre(cliente.getNombre());
            clienteActual.setApellido(cliente.getApellido());
            clienteActual.setEmail(cliente.getEmail());
            clienteActual.setCreateAt(cliente.getCreateAt());
            clienteActual.setRegion(cliente.getRegion());

            clienteUpdates = clienteService.save(clienteActual);

        }catch(DataAccessException e){
            response.put("mensaje","Error al Actualizar en la base de datos");
            response.put("error",e.getMessage().concat(":").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);

        }
        response.put("mensaje","Registro Actualizado Correctamente");
        response.put("cliente", clienteUpdates);
        return new ResponseEntity<Map<String, Object>>(response,HttpStatus.CREATED);
    }

//    Metodo Eliminar Sin manejo de errores
//    @DeleteMapping("/clientes/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void delete(@PathVariable Long id){
//        clienteService.delete(id);
//    }

    //    Metodo Eliminar con manejo de errores
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            Cliente cliente = clienteService.findById(id);
            String nombreFotoAnterior = cliente.getFoto();

            uploadFileService.eliminar(nombreFotoAnterior);

            clienteService.delete(id);

        }catch(DataAccessException e){
            response.put("mensaje","Error al Eliminar de la base de datos");
            response.put("error",e.getMessage().concat(":").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje","Registro Eliminado Correctamente");
        return new ResponseEntity<Map<String, Object>>(response,HttpStatus.OK);

    }

    @Secured({"ROLE_USER","ROLE_ADMIN"})
    @PostMapping("/clientes/upload")
    public ResponseEntity<?> upload(@RequestParam("archivo") MultipartFile archivo, @RequestParam("id") Long id){

        Map<String, Object> response = new HashMap<>();
        Cliente cliente = clienteService.findById(id);

        if(!archivo.isEmpty()){
            String nombreArchivo = null;

            try {
                nombreArchivo = uploadFileService.copiar(archivo);
            } catch (IOException e) {
                response.put("mensaje","Error al Subir la imagen: "+ nombreArchivo);
                response.put("error",e.getMessage().concat(":").concat(e.getCause().getMessage()));
                return new ResponseEntity<Map<String, Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
            }

            String nombreFotoAnterior = cliente.getFoto();
            uploadFileService.eliminar(nombreFotoAnterior);

            cliente.setFoto(nombreArchivo);
            clienteService.save(cliente);

            response.put("cliente", cliente);
            response.put("mensaje","Imagen Subida Correctamente: "+nombreArchivo);
        }
        return new ResponseEntity<Map<String, Object>>(response,HttpStatus.CREATED);
    }

    @GetMapping("/uploads/img/{nombreFoto:.+}")
    public ResponseEntity<Resource> verFoto(@PathVariable String nombreFoto){

        Resource recurso = null;
        try {
            recurso =uploadFileService.cargar(nombreFoto);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        HttpHeaders cabecera = new HttpHeaders();
        cabecera.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + recurso.getFilename() + "\"");


        return  new ResponseEntity<Resource>(recurso,cabecera,HttpStatus.OK);

    }

    @Secured("ROLE_ADMIN")
    @GetMapping("clientes/regiones")
    public List<Region> listaRegiones(){
        return clienteService.findAllRegiones();
    }


}
