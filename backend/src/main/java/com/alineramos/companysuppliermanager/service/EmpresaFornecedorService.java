package com.alineramos.companysuppliermanager.service;

import com.alineramos.companysuppliermanager.entity.Empresa;
import com.alineramos.companysuppliermanager.entity.EmpresaFornecedor;
import com.alineramos.companysuppliermanager.entity.Fornecedor;
import com.alineramos.companysuppliermanager.exception.BusinessException;
import com.alineramos.companysuppliermanager.repository.EmpresaFornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaFornecedorService {

    private final EmpresaFornecedorRepository repo;
    private final EmpresaService empresaService;
    private final FornecedorService fornecedorService;

    public void vincular(Long empresaId, Long fornecedorId) {
        if (repo.findByEmpresaIdAndFornecedorId(empresaId, fornecedorId).isPresent()) {
            throw new BusinessException("Fornecedor já vinculado a esta empresa");
        }

        Empresa empresa = empresaService.buscarEntidadeAtiva(empresaId);
        Fornecedor fornecedor = fornecedorService.buscarEntidadeAtiva(fornecedorId);

        validarRegraParana(empresa, fornecedor);

        EmpresaFornecedor ef = EmpresaFornecedor.builder()
                .empresa(empresa)
                .fornecedor(fornecedor)
                .ativo(true)
                .build();

        repo.save(ef);
    }

    public void desvincular(Long empresaId, Long fornecedorId) {
        EmpresaFornecedor ef = repo.findByEmpresaIdAndFornecedorId(empresaId, fornecedorId)
                .orElseThrow(() -> new BusinessException("Vínculo não encontrado"));

        ef.setAtivo(false);
        repo.save(ef);
    }

    public List<Fornecedor> listarFornecedoresDaEmpresa(Long empresaId) {
        return repo.findAllByEmpresaIdAndAtivoTrueOrderByFornecedorNomeAsc(empresaId).stream()
                .map(EmpresaFornecedor::getFornecedor)
                .toList();
    }

    private void validarRegraParana(Empresa empresa, Fornecedor fornecedor) {
        if ("PR".equalsIgnoreCase(empresa.getUf())
                && "PF".equalsIgnoreCase(fornecedor.getTipoPessoa())) {

            if (fornecedor.getDataNascimento() == null) {
                throw new BusinessException("Fornecedor PF deve ter data de nascimento");
            }

            int idade = Period.between(
                    fornecedor.getDataNascimento(),
                    LocalDate.now()
            ).getYears();

            if (idade < 18) {
                throw new BusinessException(
                        "Empresa do Paraná não pode vincular fornecedor PF menor de idade"
                );
            }
        }
    }
}