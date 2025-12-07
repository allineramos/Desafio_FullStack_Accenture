import { api} from "./axios";
import type { EmpresaRequest, EmpresaResponse } from "../types";

export const empresaApi = {
    listar: async (): Promise<EmpresaResponse[]> => {
        const { data} = await api.get<EmpresaResponse[]>("/empresas");
        return data;
    },

    buscar: async (id: number): Promise<EmpresaResponse> => {
        const { data} = await api.get<EmpresaResponse>(`/empresas/${id}`);
        return data;
    },

    criar: async (payload: EmpresaRequest): Promise<EmpresaResponse> => {
        const { data} = await api.post<EmpresaResponse>("/empresas", payload);
        return data;
    },

    atualizar: async (id: number, payload: EmpresaRequest): Promise<EmpresaResponse> => {
        const { data} = await api.put(`/empresas/${id}`, payload);
        return data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/empresas/${id}`);
    },
};

