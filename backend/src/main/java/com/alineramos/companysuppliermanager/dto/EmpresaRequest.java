package com.alineramos.companysuppliermanager.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class EmpresaRequest {
    @NotBlank(message = "CNPJ é obrigatório.")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve ter 14 dígitos.")
    private String cnpj;

    @NotBlank(message = "Nome fantasia é obrigatório.")
    private String nomeFantasia;

    @NotBlank(message = "Email é obrigatório.")
    @Email(message = "Email inválido.")
    private String email;

    @NotBlank(message = "Telefone é obrigatório.")
    private String telefone;

    @NotBlank(message = "CEP é obrigatório.")
    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos.")
    private String cep;
}
