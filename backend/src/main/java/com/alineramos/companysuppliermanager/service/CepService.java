package com.alineramos.companysuppliermanager.service;

import com.alineramos.companysuppliermanager.exception.ValidationException;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class CepService {
    private final RestTemplate restTemplate;

    public CepResponse validarCepOuFalhar(String cep) {
        try {
            String url = "http://cep.la/" + cep;
                        HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<CepResponse> resp =
                    restTemplate.exchange(url, HttpMethod.GET, entity, CepResponse.class);

            CepResponse body = resp.getBody();
            if (body == null || body.getUf() == null) {
                throw new ValidationException("CEP inválido");
            }
            return body;

        } catch (Exception e) {
            throw new ValidationException("CEP inválido");
            }   
    }  
}
