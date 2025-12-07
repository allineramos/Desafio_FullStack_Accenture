import { useState, useEffect } from "react";
import { empresaApi } from "../api/empresaApi";
import type { EmpresaResponse } from "../types";
import EmpresaForm from "./EmpresaForm";

export default function Empresas() {
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abrirForm, setAbrirForm] = useState(false);
  const [editando, setEditando] = useState<EmpresaResponse | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      setError(null);
      const data = await empresaApi.listar();
      setEmpresas(data);
    } catch (e: any) {
      setError("Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function onNovo() {
    setEditando(null);
    setAbrirForm(true);
  }

  function onEditar(emp: EmpresaResponse) {
    setEditando(emp);
    setAbrirForm(true);
  }

  async function onDeletar(id: number) {
    if (!confirm("Deseja desativar esta empresa?")) return;
    await empresaApi.deletar(id);
    carregar();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Empresas</h2>
        <button
          onClick={onNovo}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg fonr-medium">
          Nova Empresa
        </button>
      </header>

      {loading && <p className="text-zinc-300">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && empresas.length === 0 && (
        <p className="text-zinc-400">Nenhuma empresa cadastrada.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {empresas.map((e) => (
          <div
            key={e.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{e.nomeFantasia}</p>
                  <p className="text-sm text-zinc-400">CNPJ:{e.cnpj}</p>
                  <p className="text-sm text-zinc-400">Telefone:{e.telefone}</p>
                  <p className="text-sm text-zinc-400">Email:{e.email}</p>
                  <p className="text-sm text-zinc-400">CEP:{e.cep}</p>
                  <p className="text-sm text-zinc-400">
                  {e.cidade} - {e.uf}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditar(e)}
                    className="text-sm px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700">
                    Editar
                  </button>
                  <button
                    onClick={() => onDeletar(e.id)}
                    className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-700">
                    Desativar
                  </button>
                </div>
              </div>
          </div>
        ))}

      </div>

      {abrirForm && (
        <EmpresaForm
          empresa={editando}
          onClose={() => setAbrirForm(false)}
          onSaved={() => {
            setAbrirForm(false);
            carregar();
          }}
        />
      )}

    </div>
  );
}
