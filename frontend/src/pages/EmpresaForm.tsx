import { useEffect, useState, useRef } from "react";
import { empresaApi } from "../api/empresaApi";
import type { EmpresaRequest,EmpresaResponse } from "../types";


type Props = {
    empresa: EmpresaResponse | null;
    onClose: () => void;
    onSaved: () => void;
};

export default function EmpresaForm({ empresa, onClose, onSaved }: Props) {
    const [form, setForm] = useState<EmpresaRequest>({
        cnpj: empresa?.cnpj ?? "",
        nomeFantasia: empresa?.nomeFantasia ?? "",
        telefone: empresa?.telefone ?? "",
        email: empresa?.email ?? "",
        cep: empresa?.cep ?? "",
    });

    const [logradouro, setLogradouro] = useState<string>(empresa?.logradouro ?? "");
    const [bairro, setBairro] = useState<string>(empresa?.bairro ?? "");
    const [cidade, setCidade] = useState<string>(empresa?.cidade ?? "");
    const [uf, setUf] = useState<string>(empresa?.uf ?? "");
    const [cepError, setCepError] = useState<string | null>(null);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const debounceRef = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);

    function update<K extends keyof EmpresaRequest>(key: K, value: EmpresaRequest[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    useEffect(() => {
        const cepLimpo = (form.cep || "").replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            setCepError(null);
            setBuscandoCep(false);
            setLogradouro("");
            setBairro("");
            setCidade("");
            setUf("");
            return;
        }

        if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        setBuscandoCep(true);
        setCepError(null);

        // você já tem /cep/{cep} no back
        const res = await empresaApi.consultarCep(cepLimpo);

        setLogradouro(res.logradouro ?? "");
        setBairro(res.bairro ?? "");
        setCidade(res.cidade ?? "");
        setUf(res.uf ?? "");
      } catch {
        setCepError("CEP inválido");
        setLogradouro("");
        setBairro("");
        setCidade("");
        setUf("");
      } finally {
        setBuscandoCep(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [form.cep]);
        

    async function salvar() {
        try {
            setSalvando(true);
            setError(null);

            if(!form.cnpj || !form.nomeFantasia || !form.telefone || !form.email || !form.cep) {
                setError("Por favor, preencha todos os campos.");
                return;
            }

            if (cepError) {
                setError("Por favor, corrija o CEP antes de salvar.");
                return;
            }
            
            const payload: EmpresaRequest = {
                cnpj: form.cnpj,
                nomeFantasia: form.nomeFantasia,
                telefone: form.telefone,
                email: form.email,
                cep: form.cep.replace(/\D/g, ""),
            };

            if (empresa) {
                await empresaApi.atualizar(empresa.id, payload);
            } else {
                await empresaApi.criar(payload);
            }

            onSaved();
        } catch (e: any) {
            setError(e?.response?.data?.error ?? "Erro ao salvar empresa");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black-60 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-zinc-950 border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold">
                    {empresa ? "Editar Empresa" : "Nova Empresa"}
                </h3>

                {error && <p className="text-red-400">{error}</p>}

                <div className="space-y-3">
                    <input
                        className="w-full bg-zinc-900 border order-zinc-700 rounded-lg p-2"
                        placeholder="CNPJ (14 dígitos)"
                        value={form.cnpj}
                        onChange={(e) => update("cnpj", e.target.value)}
                    />
                    <input
                        className="w-full bg-zinc-900 border order-zinc-700 rounded-lg p-2"
                        placeholder="Nome Fantasia"
                        value={form.nomeFantasia}
                        onChange={(e) => update("nomeFantasia", e.target.value)}
                    />
                    <input
                        className="w-full bg-zinc-900 border order-zinc-700 rounded-lg p-2"
                        placeholder="Telefone"
                        value={form.telefone}
                        onChange={(e) => update("telefone", e.target.value)}
                    />
                    <input
                        className="w-full bg-zinc-900 border order-zinc-700 rounded-lg p-2"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                    />
                    <input
                        className="w-full bg-zinc-900 border order-zinc-700 rounded-lg p-2"
                        placeholder="CEP"
                        value={form.cep}
                        onChange={(e) => update("cep", e.target.value)}
                    />
                    {buscandoCep && (
                        <p className="text-xs text-zinc-400 mt-1">Buscando CEP...</p>
                    )}
                        {cepError && (
                        <p className="text-xs text-red-400 mt-1">{cepError}</p>
                    )}
                </div>

                <input
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                    placeholder="Logradouro"
                    value={logradouro}
                    readOnly
                />
                <input
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                    placeholder="Bairro"
                    value={bairro}
                    readOnly
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                        placeholder="Cidade"
                        value={cidade}
                        readOnly
                    />
                    <input
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                        placeholder="UF"
                        value={uf}
                        readOnly
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-center">
                        Cancelar
                    </button>
                    <button
                        onClick={salvar}
                        disabled={salvando}
                        className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-center">
                        {salvando ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}