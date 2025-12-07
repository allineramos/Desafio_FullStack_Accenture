package com.alineramos.companysuppliermanager.service;

import com.alineramos.companysuppliermanager.dto.FornecedorRequest;
import com.alineramos.companysuppliermanager.dto.FornecedorResponse;
import com.alineramos.companysuppliermanager.entity.Fornecedor;
import com.alineramos.companysuppliermanager.exception.BusinessException;
import com.alineramos.companysuppliermanager.exception.NotFoundException;
import com.alineramos.companysuppliermanager.exception.ValidationException;
import com.alineramos.companysuppliermanager.repository.FornecedorRepository;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final CepService cepService;

    public FornecedorResponse criar(FornecedorRequest req) {
        if (fornecedorRepository.existsByCpfCnpj(req.getCpfCnpj())) {
            throw new BusinessException("CPF/CNPJ já cadastrado");
        }

        validarPf(req);

        CepResponse cep = cepService.validarCepOuFalhar(req.getCep());

        Fornecedor f = Fornecedor.builder()
                .tipoPessoa(req.getTipoPessoa())
                .cpfCnpj(req.getCpfCnpj())
                .nome(req.getNome())
                .email(req.getEmail())
                .telefone(req.getTelefone())
                .cep(req.getCep())
                .uf(cep.getUf())
                .cidade(cep.getCidade())
                .logradouro(cep.getLogradouro())
                .bairro(cep.getBairro())
                .rg(req.getRg())
                .dataNascimento(req.getDataNascimento())
                .ativo(true)
                .build();

        return toResponse(fornecedorRepository.save(f));
    }

    public List<FornecedorResponse> listar(String nome, String cpfCnpj) {
        String n = nome == null ? "" : nome;
        String c = cpfCnpj == null ? "" : cpfCnpj;

        return fornecedorRepository
                .findByAtivoTrueAndNomeContainingIgnoreCaseAndCpfCnpjContainingOrderByNomeAsc(n, c)
                .stream().map(this::toResponse).toList();
    }

    public FornecedorResponse buscar(Long id) {
        return toResponse(buscarEntidadeAtiva(id));
    }

    public FornecedorResponse atualizar(Long id, FornecedorRequest req) {
        Fornecedor f = buscarEntidadeAtiva(id);

        if (!f.getCpfCnpj().equals(req.getCpfCnpj())
                && fornecedorRepository.existsByCpfCnpj(req.getCpfCnpj())) {
            throw new BusinessException("CPF/CNPJ já cadastrado");
        }

        validarPf(req);
        CepResponse cep = cepService.validarCepOuFalhar(req.getCep());

        f.setTipoPessoa(req.getTipoPessoa());
        f.setCpfCnpj(req.getCpfCnpj());
        f.setNome(req.getNome());
        f.setEmail(req.getEmail());
        f.setTelefone(req.getTelefone());
        f.setCep(req.getCep());
        f.setUf(cep.getUf());
        f.setCidade(cep.getCidade());
        f.setLogradouro(cep.getLogradouro());
        f.setBairro(cep.getBairro());
        f.setRg(req.getRg());
        f.setDataNascimento(req.getDataNascimento());

        return toResponse(fornecedorRepository.save(f));
    }

    public void deletar(Long id) {
        Fornecedor f = buscarEntidadeAtiva(id);
        f.setAtivo(false);
        fornecedorRepository.save(f);
    }

    public Fornecedor buscarEntidadeAtiva(Long id) {
        Fornecedor f = fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor não encontrado"));
        if (!Boolean.TRUE.equals(f.getAtivo())) {
            throw new NotFoundException("Fornecedor não encontrado");
        }
        return f;
    }

    private void validarPf(FornecedorRequest req) {
        if ("PF".equalsIgnoreCase(req.getTipoPessoa())) {
            if (req.getRg() == null || req.getRg().isBlank()) {
                throw new ValidationException("RG é obrigatório para pessoa física");
            }
            if (req.getDataNascimento() == null) {
                throw new ValidationException("Data de nascimento é obrigatória para pessoa física");
            }
        }
    }

    public FornecedorResponse toResponse(Fornecedor f) {
        return FornecedorResponse.builder()
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
                .build();
    }
}