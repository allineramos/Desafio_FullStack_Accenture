package com.alineramos.companysuppliermanager.controller;

import com.alineramos.companysuppliermanager.dto.EmpresaRequest;
import com.alineramos.companysuppliermanager.dto.EmpresaResponse;
import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.entity.Fornecedor;
import com.alineramos.companysuppliermanager.service.EmpresaFornecedorService;
import com.alineramos.companysuppliermanager.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final EmpresaFornecedorService empresaFornecedorService;

    @PostMapping
    public EmpresaResponse criar(@Valid @RequestBody EmpresaRequest req) {
        return empresaService.criar(req);
    }

    @GetMapping
    public List<EmpresaResponse> listar() {
        return empresaService.listar();
    }

    @GetMapping("/{id}")
    public EmpresaResponse buscar(@PathVariable Long id) {
        return empresaService.buscar(id);
    }

    @PutMapping("/{id}")
    public EmpresaResponse atualizar(@PathVariable Long id,
                                    @Valid @RequestBody EmpresaRequest req) {
        return empresaService.atualizar(id, req);
    }
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        empresaService.excluir(id);
    }
    public List<FornecedorResponse> listarFornecedores(@PathVariable Long empresaId) {
        List<Fornecedor> fornecedores = empresaFornecedorService.listarFornecedoresDaEmpresa(empresaId);
        return fornecedores.stream().map(f -> FornecedorResponse.builder()
                .id(f.getId())
                .tipoPessoa(f.getTipoPessoa())
                .cpfCnpj(f.getCpfCnpj())
                .nome(f.getNome())
                .email(f.getEmail())
                .telefone(f.getTelefone())
                .cep(f.getCep())
                .uf(f.getUf())
                .cidade(f.getCidade())
                .logradouro(f.getLogradouro())
                .bairro(f.getBairro())
                .rg(f.getRg())
                .dataNascimento(f.getDataNascimento())
                .ativo(f.getAtivo())
                .build()
        ).toList();
    }

    @PostMapping("/{empresaId}/fornecedores/{fornecedorId}")
    public void vincular(@PathVariable Long empresaId,
                         @PathVariable Long fornecedorId) {
        empresaFornecedorService.vincular(empresaId, fornecedorId);
    }

    @DeleteMapping("/{empresaId}/fornecedores/{fornecedorId}")
    public void desvincular(@PathVariable Long empresaId,
                            @PathVariable Long fornecedorId) {
        empresaFornecedorService.desvincular(empresaId, fornecedorId);
    }
}

