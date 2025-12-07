package com.alineramos.companysuppliermanager.repository;

import com.alineramos.companysuppliermanager.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    boolean existsByCpfCnpj(String cpfCnpj);

    Optional<Fornecedor> findByCpfCnpj(String cpfCnpj);

    List<Fornecedor> findByAtivoTrueAndNomeContainingIgnoreCaseAndCpfCnpjContaining(
            String nome, String cpfCnpj
    );
}
