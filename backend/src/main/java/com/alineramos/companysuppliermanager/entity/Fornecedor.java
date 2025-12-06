package com.alineramos.companysuppliermanager.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "fornecedor" , 
    uniqueConstraints = @UniqueConstraint(
        name = "uk_fornecedor_cpf_cnpj" , columnNames = "cpf_cnpj")
    )

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Fornecedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "tipo_pessoa" , nullable = false, length=2)
    private String tipoPessoa;

    @Column(name = "cpf_cnpj" , nullable = false, length = 14, unique = true)
    private String cpfCnpj;

    @Column(name = "nome" , nullable = false, length = 120)
    private String nome;

    @Column(name = "email" , nullable = false, length = 120)
    private String email;

    @Column(name="telefone", nullable=false, length=20)
    private String telefone;

    @Column(name = "cep" , nullable = false, length = 8)
    private String cep;

    @Column(name = "uf" , nullable = false, length = 2)
    private String uf;

    private String cidade;
    private String logradouro;
    private String bairro;
    private String rg;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;
    
    @Column(name = "ativo" , nullable = false)
    private Boolean ativo = true;
}
