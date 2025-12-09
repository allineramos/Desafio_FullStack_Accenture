package com.alineramos.companysuppliermanager.service.cep;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "viaCepClient", url = "https://viacep.com.br")
public interface ViaCepClient {

    @GetMapping(value = "/ws/{cep}/json/", produces = MediaType.APPLICATION_JSON_VALUE)
    ViaCepResponse buscarCep(@PathVariable("cep") String cep);
}
