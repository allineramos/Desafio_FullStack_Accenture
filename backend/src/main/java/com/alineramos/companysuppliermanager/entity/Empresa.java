package com.alineramos.companysuppliermanager.entity;
package com.alineramos.company_supplier_manager.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empresa" , 
    uniqueConstraints = @UniqueConstraint(name = "uk_empresa_cnpj" , columnNames = "cnpj"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Empresa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "cnpj" , nullable = false, length = 14)
    private String cnpj;

    @Column(name = "nome_fantasia" , nullable = false, length = 120)
    private String nomeFantasia;

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

    @Column(name = "ativo" , nullable = false)
    private Boolean ativo = true;


}
