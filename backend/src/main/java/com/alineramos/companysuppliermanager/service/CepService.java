package com.alineramos.companysuppliermanager.service;

import org.springframework.stereotype.Service;

import com.alineramos.companysuppliermanager.exception.ValidationException;
import com.alineramos.companysuppliermanager.service.cep.CepResponse;
import com.alineramos.companysuppliermanager.service.cep.ViaCepClient;
import com.alineramos.companysuppliermanager.service.cep.ViaCepResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CepService {

    private final ViaCepClient viaCepClient;

    public CepResponse validarCepOuFalhar(String cep) {
        String cepLimpo = cep.replaceAll("\\D", "");
        if (cepLimpo.length() != 8) {
            throw new ValidationException("CEP inválido");
        }
        

        ViaCepResponse raw;
        try {
            raw = viaCepClient.buscarCep(cepLimpo); // <- chamada Feign
        } catch (Exception e) {
            throw new ValidationException("CEP inválido"); // <- throw correto
        }

        if (raw == null || Boolean.TRUE.equals(raw.getErro()) || raw.getUf() == null) {
            throw new ValidationException("CEP inválido");
        }

        // converte raw (externo) -> CepResponse (interno)
        CepResponse c = new CepResponse();
        c.setCep(raw.getCep());
        c.setUf(raw.getUf());
        c.setCidade(raw.getLocalidade());
        c.setLogradouro(raw.getLogradouro());
        c.setBairro(raw.getBairro());
        return c;
    }
}

