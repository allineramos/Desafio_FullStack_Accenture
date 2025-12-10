package com.alineramos.companysuppliermanager.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alineramos.companysuppliermanager.dto.EmpresaRequest;
import com.alineramos.companysuppliermanager.dto.EmpresaResponse;
import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.entity.Fornecedor;
import com.alineramos.companysuppliermanager.service.EmpresaFornecedorService;
import com.alineramos.companysuppliermanager.service.EmpresaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final EmpresaFornecedorService empresaFornecedorService;

    @PostMapping
    public EmpresaResponse criar(@Valid @RequestBody EmpresaRequest req) {
        return empresaService.criar(req);
    }

    @GetMapping
    public Page<EmpresaResponse> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cnpj,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return empresaService.listar(nome, cnpj, page, size);
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
}

