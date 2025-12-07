package com.alineramos.companysuppliermanager.controller;

import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.entity.Fornecedor;
import com.alineramos.companysuppliermanager.service.EmpresaFornecedorService;
import com.alineramos.companysuppliermanager.service.FornecedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
@CrossOrigin
@RequiredArgsConstructor
public class EmpresaFornecedorController {

    private final EmpresaFornecedorService empresaFornecedorService;
    private final FornecedorService fornecedorService;

    // LISTAR fornecedores vinculados a uma empresa
    @GetMapping("/{empresaId}/fornecedores")
    public List<FornecedorResponse> listarFornecedoresDaEmpresa(@PathVariable Long empresaId) {
        List<Fornecedor> fornecedores =
                empresaFornecedorService.listarFornecedoresDaEmpresa(empresaId);

        return fornecedores.stream()
                .map(fornecedorService::toResponse)
                .toList();
    }

  
    @PostMapping("/{empresaId}/fornecedores/{fornecedorId}")
    public void vincular(@PathVariable Long empresaId, @PathVariable Long fornecedorId) {
        empresaFornecedorService.vincular(empresaId, fornecedorId);
    }


    @DeleteMapping("/{empresaId}/fornecedores/{fornecedorId}")
    public void desvincular(@PathVariable Long empresaId, @PathVariable Long fornecedorId) {
        empresaFornecedorService.desvincular(empresaId, fornecedorId);
    }
}
