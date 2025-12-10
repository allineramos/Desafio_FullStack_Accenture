package com.alineramos.companysuppliermanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alineramos.companysuppliermanager.service.CepService;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cep")
public class CepController {

    private final CepService cepService;

    @GetMapping("/{cep}")
    public CepResponse consultar(@PathVariable String cep) {
        return cepService.validarCepOuFalhar(cep);
    }
}