package com.alineramos.companysuppliermanager.service;

import com.alineramos.companysuppliermanager.dto.EmpresaRequest;
import com.alineramos.companysuppliermanager.dto.EmpresaResponse;
import com.alineramos.companysuppliermanager.entity.Empresa;
import com.alineramos.companysuppliermanager.exception.BusinessException;
import com.alineramos.companysuppliermanager.exception.NotFoundException;
import com.alineramos.companysuppliermanager.repository.EmpresaRepository;
import com.alineramos.companysuppliermanager.service.CepService;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class EmpresaService {
    private final EmpresaRepository empresaRepository;
    private final CepService cepService;

    public EmpresaResponse criar(EmpresaRequest req) {
        if (empresaRepository.existsByCnpj(req.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado");
        }

        CepResponse cep = cepService.validarCepOuFalhar(req.getCep());

        Empresa e = Empresa.builder()
                .cnpj(req.getCnpj())
                .nomeFantasia(req.getNomeFantasia())
                .email(req.getEmail())
                .telefone(req.getTelefone())
                .cep(req.getCep())
                .uf(cep.getUf())
                .cidade(cep.getCidade())
                .logradouro(cep.getLogradouro())
                .bairro(cep.getBairro())
                .ativo(true)
                .build();

        return toResponse(empresaRepository.save(e));
    }

    public EmpresaResponse buscar(Long id) {
        Empresa e = buscarEntidadeAtiva(id);
        return toResponse(e);
    }
    public EmpresaResponse atualizar(Long id, EmpresaRequest req) {
        Empresa e = buscarEntidadeAtiva(id);

        if (!e.getCnpj().equals(req.getCnpj())
                && empresaRepository.existsByCnpj(req.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado");
        }

        CepResponse cep = cepService.validarCepOuFalhar(req.getCep());

        e.setCnpj(req.getCnpj());
        e.setNomeFantasia(req.getNomeFantasia());
        e.setTelefone(req.getTelefone());
        e.setCep(req.getCep());
        e.setUf(cep.getUf());
        e.setCidade(cep.getCidade());
        e.setLogradouro(cep.getLogradouro());
        e.setBairro(cep.getBairro());

        return toResponse(empresaRepository.save(e));
    }

    public void excluir(Long id) {
        Empresa e = buscarEntidadeAtiva(id);
        e.setAtivo(false);
        empresaRepository.save(e);
    }

    public Empresa buscarEntidadeAtiva(Long id) {
        return empresaRepository.findById(id)
                .filter(Empresa::getAtivo)
                .orElseThrow(() -> new NotFoundException("Empresa não encontrada"));
    }

    private EmpresaResponse toResponse(Empresa e) {
        return EmpresaResponse.builder()
                .id(e.getId())
                .cnpj(e.getCnpj())
                .nomeFantasia(e.getNomeFantasia())
                .email(e.getEmail())
                .telefone(e.getTelefone())
                .cep(e.getCep())
                .uf(e.getUf())
                .cidade(e.getCidade())
                .logradouro(e.getLogradouro())
                .bairro(e.getBairro())
                .ativo(e.getAtivo())
                .build();
    }

    public Page<EmpresaResponse> listar(String nome, String cnpj, int page, int size) {
    String n = nome == null ? "" : nome;
    String c = cnpj == null ? "" : cnpj;

    Pageable pageable = PageRequest.of(page, size, Sort.by("nomeFantasia").ascending());

    return empresaRepository
            .findByAtivoTrueAndNomeFantasiaContainingIgnoreCaseAndCnpjContaining(n, c, pageable)
            .map(this::toResponse);
    }
}
