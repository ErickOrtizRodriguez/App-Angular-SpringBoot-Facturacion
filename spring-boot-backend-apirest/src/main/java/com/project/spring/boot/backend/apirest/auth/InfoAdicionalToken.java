package com.project.spring.boot.backend.apirest.auth;

import com.project.spring.boot.backend.apirest.models.entity.Usuario;
import com.project.spring.boot.backend.apirest.models.services.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class InfoAdicionalToken implements TokenEnhancer {
    @Autowired
    private IUsuarioService iUsuarioService;


    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken oAuth2AccessToken, OAuth2Authentication oAuth2Aucthentication) {
        Usuario usuario = iUsuarioService.findByUsername(oAuth2Aucthentication.getName());
        Map<String,Object> info = new HashMap<>();
        info.put("info_adicional","Hola Bienvenido: ".concat(oAuth2Aucthentication.getName()));

        info.put("Nombre_Usuario",usuario.getId()+":"+usuario.getUsername());

        info.put("Nombre_Usuario",usuario.getNombre());
        info.put("Apellido_Usuario",usuario.getApellido());
        info.put("Email_Usuario",usuario.getEmail());

        ((DefaultOAuth2AccessToken)oAuth2AccessToken).setAdditionalInformation(info);
        return oAuth2AccessToken;
    }
}
