package com.alineramos.companysuppliermanager.service.cep;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)

public class CepResponse {

    private String cep;
    private String uf;
    private String cidade;
    private String bairro;

    @JsonProperty("logradouro")
    private String logradouro;
}
