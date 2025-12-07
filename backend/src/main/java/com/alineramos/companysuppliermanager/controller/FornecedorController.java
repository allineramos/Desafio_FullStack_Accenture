package com.alineramos.companysuppliermanager.controller;

import com.alineramos.companysuppliermanager.dto.FornecedorRequest;
import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/fornecedores")

public class FornecedorController {
    private final FornecedorService fornecedorService;

    @PostMapping
    public FornecedorResponse criar(@Valid @RequestBody FornecedorRequest req) {
        return fornecedorService.criar(req);
    }

    @GetMapping
    public List<FornecedorResponse> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpfCnpj
    ) {
        return fornecedorService.listar(nome, cpfCnpj);
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
