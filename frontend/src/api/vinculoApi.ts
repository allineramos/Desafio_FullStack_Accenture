import { api } from "./axios";
import type { FornecedorResponse } from "../types";

export const vinculoApi = {
  listarFornecedoresDaEmpresa: async (empresaId: number): Promise<FornecedorResponse[]> => {
    const { data } = await api.get<FornecedorResponse[]>(
      `/empresas/${empresaId}/fornecedores`
    );
    return data;
  },

  vincular: async (empresaId: number, fornecedorId: number): Promise<void> => {
    await api.post(`/empresas/${empresaId}/fornecedores/${fornecedorId}`);
  },

  desvincular: async (empresaId: number, fornecedorId: number): Promise<void> => {
    await api.delete(`/empresas/${empresaId}/fornecedores/${fornecedorId}`);
  },
};
