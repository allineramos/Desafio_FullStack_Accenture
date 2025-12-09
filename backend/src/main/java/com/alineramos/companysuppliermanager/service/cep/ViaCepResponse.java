package com.alineramos.companysuppliermanager.service.cep;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ViaCepResponse {
    private String cep;
    private String uf;
    private String localidade;
    private String bairro;
    private String logradouro;
    private Boolean erro;
}