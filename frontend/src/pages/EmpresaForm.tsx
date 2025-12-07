import { useState} from "react";
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

    const [error, setError] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);

    function update<K extends keyof EmpresaRequest>(key: K, value: EmpresaRequest[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function salvar() {
        try {
            setSalvando(true);
            setError(null);

            if(!form.cnpj || !form.nomeFantasia || !form.telefone || !form.email || !form.cep) {
                setError("Por favor, preencha todos os campos.");
                return;
            }

            if (empresa) {
                await empresaApi.atualizar(empresa.id, form);
            } else {
                await empresaApi.criar(form);
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
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700">
                        Cancelar
                    </button>
                    <button
                        onClick={salvar}
                        disabled={salvando}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60">
                        {salvando ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}