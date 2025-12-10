import { api} from "./axios";
import type { EmpresaRequest, EmpresaResponse , PageResponse, CepResponse} from "../types";

type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

export const empresaApi = {
    listar: async (
        nome?: string,
        cnpj?: string,
        page = 0,
        size = 10
    ): Promise<PageResponse<EmpresaResponse>> => {
        const { data } = await api.get("/empresas", {
        params: { nome, cnpj, page, size }
     });
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

    consultarCep: async (cep: string): Promise<CepResponse> => {
        const { data } = await api.get<CepResponse>(`/cep/${cep}`);
        return data;
    }
};

