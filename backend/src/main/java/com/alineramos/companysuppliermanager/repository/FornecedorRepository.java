package com.alineramos.companysuppliermanager.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.alineramos.companysuppliermanager.entity.Fornecedor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    boolean existsByCpfCnpj(String cpfCnpj);

    Optional<Fornecedor> findByCpfCnpj(String cpfCnpj);

    Page<Fornecedor> findByAtivoTrue(Pageable pageable);

    Page<Fornecedor> findByAtivoTrueAndNomeContainingIgnoreCase(
            String nome, Pageable pageable
    );

    Page<Fornecedor> findByAtivoTrueAndCpfCnpjContaining(
            String cpfCnpj, Pageable pageable
    );

    Page<Fornecedor> findByAtivoTrueAndNomeContainingIgnoreCaseAndCpfCnpjContaining(
            String nome, String cpfCnpj, Pageable pageable
    );
}
