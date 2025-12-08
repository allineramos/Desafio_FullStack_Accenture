package com.alineramos.companysuppliermanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.alineramos.companysuppliermanager.entity.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
        boolean existsByCnpj(String cnpj);
        Optional<Empresa> findByIdAndAtivoTrue(Long id);

            Page<Empresa> findByAtivoTrueAndNomeFantasiaContainingIgnoreCaseAndCnpjContaining(
        String nomeFantasia, String cnpj, Pageable pageable
);
    }    



