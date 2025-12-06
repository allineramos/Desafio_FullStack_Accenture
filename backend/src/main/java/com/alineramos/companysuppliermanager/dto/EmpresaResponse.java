package com.alineramos.companysuppliermanager.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class EmpresaResponse {

    private Long id;
    private String cnpj;
    private String nomeFantasia;
    private String email;
    private String telefone;
    private String cep;
    private String uf;
    private String cidade;
    private String logradouro;
    private String bairro;
    
    private Boolean ativo;
}
