package com.alineramos.companysuppliermanager.service.cep;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CepResponse {

    private String cep;
    private String uf;
    private String cidade;
    private String logradouro;
    private String bairro;
}
