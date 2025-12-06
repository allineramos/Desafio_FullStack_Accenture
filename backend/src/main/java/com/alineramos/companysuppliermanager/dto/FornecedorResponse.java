package com.alineramos.companysuppliermanager.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class FornecedorResponse {

    private Long id;
    private String tipoPessoa;
    private String cpfCnpj;
    private String nome;
    private String email;
    private String telefone;
    private String cep;
    private String uf;
    private String cidade;
    private String logradouro;
    private String bairro;
    
    //somente para pessoa física
    private String rg;
    private LocalDate dataNascimento;

    private Boolean ativo;
}
