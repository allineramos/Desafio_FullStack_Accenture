package com.alineramos.companysuppliermanager.service;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alineramos.companysuppliermanager.exception.ValidationException;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CepService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CepResponse validarCepOuFalhar(String cep) {
        String cepLimpo = cep.replaceAll("\\D", "");
        if (cepLimpo.length() != 8) {
            throw new ValidationException("CEP inválido");
        }

        // 1) tenta cep.la primeiro (requisito)
        CepResponse respCepLa = consultarCepLa(cepLimpo);
        if (respCepLa != null && respCepLa.getUf() != null) {
            return respCepLa;
        }
        // 2) tenta ViaCEP como fallback
        CepResponse respViaCep = consultarViaCep(cepLimpo);
        if (respViaCep != null && respViaCep.getUf() != null) {
            return respViaCep;
        }

        throw new ValidationException("CEP inválido");
    }

    private CepResponse consultarCepLa(String cep) {
        try {
            String url = "https://cep.la/api/" + cep;

            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.add("User-Agent", "Mozilla/5.0");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> resp =
                    restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            String bodyStr = resp.getBody();
            if (bodyStr == null || bodyStr.isBlank()) return null;

            JsonNode json = objectMapper.readTree(bodyStr);

            JsonNode node = json.isArray() ? json.get(0) : json;

            if (node == null || node.get("uf") == null) return null;

            CepResponse c = new CepResponse();
            c.setCep(getText(node, "cep"));
            c.setUf(getText(node, "uf"));
            c.setCidade(getText(node, "cidade"));
            c.setLogradouro(getText(node, "logradouro"));
            c.setBairro(getText(node, "bairro"));
            return c;

        } catch (Exception e) {
            return null;
        }
    }

    private CepResponse consultarViaCep(String cep) {
        try {
            String url = "https://viacep.com.br/ws/" + cep + "/json/";

            ResponseEntity<String> resp =
                    restTemplate.getForEntity(url, String.class);

            String bodyStr = resp.getBody();
            if (bodyStr == null || bodyStr.isBlank()) return null;

            JsonNode node = objectMapper.readTree(bodyStr);

            if (node.get("erro") != null && node.get("erro").asBoolean()) return null;

            CepResponse c = new CepResponse();
            c.setCep(getText(node, "cep"));
            c.setUf(getText(node, "uf"));
            c.setCidade(getText(node, "localidade"));
            c.setLogradouro(getText(node, "logradouro"));
            c.setBairro(getText(node, "bairro"));
            return c;

        } catch (Exception e) {
            return null;
        }
    }

    private String getText(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }
}
