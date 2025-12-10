export interface EmpresaRequest {
    cnpj: string;
    nomeFantasia: string;
    email: string;
    telefone: string;
    cep: string;
}

export interface EmpresaResponse extends EmpresaRequest {
    id: number;
    uf: string;
    cidade? : string;
    bairro? : string;
    logradouro? : string;
    ativo: boolean;
}

export interface FornecedorRequest {
    tipoPessoa: string;
    cpfCnpj: string;
    nome: string;
    email: string;
    telefone: string;
    cep: string;
    rg?: string;
    dataNascimento?: string;
}

export interface FornecedorResponse extends FornecedorRequest {
    id: number;
    uf: string;
    cidade? : string;
    bairro? : string;
    logradouro? : string;
    ativo: boolean;
}

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  number: number; // página atual
  totalElements: number;
};

export type CepResponse = {
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
};

