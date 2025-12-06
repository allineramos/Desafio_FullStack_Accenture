package com.alineramos.companysuppliermanager.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class FornecedorRequest {
    @NotBlank(message = "Tipo de fornecedor é obrigatório (PF ou PJ).")
    @Pattern(regexp = "PF|PJ", message = "Tipo de fornecedor deve ser 'PF' ou 'PJ'.")
    private String tipoPessoa;

    @NotBlank(message = "CPF/CNPJ é obrigatório.")
    @Pattern(regexp = "\\d{11}|\\d{14}", message = "CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos.")
    private String cpfCnpj;

    @NotBlank(message = "Nome é obrigatório.")
    private String nome;

    @NotBlank(message = "Email é obrigatório.")
    @Email(message = "Email inválido.")
    private String email;

    @NotBlank(message = "Telefone é obrigatório.")
    private String telefone;

    @NotBlank(message = "CEP é obrigatório.")
    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos.")
    private String cep;

    //somente para pessoa física
    private String rg;
    private LocalDate dataNascimento;
}
