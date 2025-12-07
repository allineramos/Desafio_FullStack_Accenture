import { api } from "./axios";
import type { FornecedorRequest, FornecedorResponse } from "../types";

export const fornecedorApi = {
  listar: async (nome?: string, cpfCnpj?: string): Promise<FornecedorResponse[]> => {
    const params: any = {};
    if (nome) params.nome = nome;
    if (cpfCnpj) params.cpfCnpj = cpfCnpj;

    const { data } = await api.get<FornecedorResponse[]>("/fornecedores", { params });
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
};
