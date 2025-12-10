package com.alineramos.companysuppliermanager.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alineramos.companysuppliermanager.dto.FornecedorRequest;
import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.service.FornecedorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fornecedores")

public class FornecedorController {
    private final FornecedorService fornecedorService;

    @PostMapping
    public FornecedorResponse criar(@Valid @RequestBody FornecedorRequest req) {
        return fornecedorService.criar(req);
    }

    @GetMapping
    public Page<FornecedorResponse> listar(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String cpfCnpj,
        @PageableDefault(size = 10) Pageable pageable
    ) {
        return fornecedorService.listar(nome, cpfCnpj, pageable);
    }

    @GetMapping("/{id}")
    public FornecedorResponse buscar(@PathVariable Long id) {
        return fornecedorService.buscar(id);
    }

    @PutMapping("/{id}")
    public FornecedorResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FornecedorRequest req
    ) {
        return fornecedorService.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        fornecedorService.deletar(id);
    }
}
