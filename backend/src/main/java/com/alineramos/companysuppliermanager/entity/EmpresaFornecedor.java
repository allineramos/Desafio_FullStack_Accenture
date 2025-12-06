package com.alineramos.companysuppliermanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.*;

@Entity
@Table(
    name = "empresa_fornecedor",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_empresa_fornecedor" , 
        columnNames = {"empresa_id", "fornecedor_id"}
    )
)

@Getter
@Setter
@AllArgsConstructor 
@NoArgsConstructor
@Builder


public class EmpresaFornecedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @Column(name = "data_cadastro" , nullable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Column(name = "ativo" , nullable = false)
    private Boolean ativo = true;
}
