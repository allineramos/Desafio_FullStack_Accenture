import { api } from "./axios";
import type { FornecedorRequest, FornecedorResponse, PageResponse, CepResponse } from "../types";

export const fornecedorApi = {
  listar: async (
    nome?: string,
    cpfCnpj?: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<FornecedorResponse>> => {
    const { data } = await api.get("/fornecedores", {
      params: { nome, cpfCnpj, page, size },
    });
    return data;
  },

  buscar: async (id: number): Promise<FornecedorResponse> => {
    const { data } = await api.get<FornecedorResponse>(`/fornecedores/${id}`);
    return data;
  },

  criar: async (payload: FornecedorRequest): Promise<FornecedorResponse> => {
    const { data } = await api.post<FornecedorResponse>("/fornecedores", payload);
    return data;
  },

  atualizar: async (id: number, payload: FornecedorRequest): Promise<FornecedorResponse> => {
    const { data } = await api.put<FornecedorResponse>(`/fornecedores/${id}`, payload);
    return data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/fornecedores/${id}`);
  },

  consultarCep: async (cep: string): Promise<CepResponse> => {
    const { data } = await api.get(`/cep/${cep}`);
    return data;
  }
};
