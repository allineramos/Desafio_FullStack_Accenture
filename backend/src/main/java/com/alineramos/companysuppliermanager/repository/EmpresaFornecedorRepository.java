package com.alineramos.companysuppliermanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.alineramos.companysuppliermanager.entity.EmpresaFornecedor;

import java.util.Optional;
import java.util.List;

public interface EmpresaFornecedorRepository extends JpaRepository<EmpresaFornecedor, Long> {

    Optional<EmpresaFornecedor> findByEmpresaIdAndFornecedorId(Long empresaId, Long fornecedorId);

    List<EmpresaFornecedor> findAllByEmpresaIdAndAtivoTrue(Long empresaId);
    List<EmpresaFornecedor> findAllByEmpresaIdAndAtivoTrueOrderByFornecedorNomeAsc(Long empresaId);
}