import { useState, useEffect, useRef } from "react";
import { empresaApi } from "../api/empresaApi";
import type { EmpresaResponse } from "../types";
import EmpresaForm from "./EmpresaForm";


export default function Empresas() {
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const debounceRef = useRef<number | null>(null);

  const [abrirForm, setAbrirForm] = useState(false);
  const [editando, setEditando] = useState<EmpresaResponse | null>(null);

  async function carregar(p: number = page) {
  try {
    setLoading(true);
    setError(null);

    const res = await empresaApi.listar(
      filtroNome.trim() || undefined,
      filtroCnpj.trim() || undefined,
      p,
      size
    );

    setEmpresas(res.content ?? []);
    setTotalPages(res.totalPages ?? 0);
    setPage(res.number ?? p);

  } catch {
    setError("Erro ao carregar empresas");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    carregar(page);
  }, [page]);

  useEffect(() => {
  if (debounceRef.current) window.clearTimeout(debounceRef.current);

  debounceRef.current = window.setTimeout(() => {
    carregar(0); // sempre volta pra primeira página ao filtrar
  }, 400);

  return () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
  };
}, [filtroNome, filtroCnpj]);

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

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="text-sm text-zinc-300">Nome Fantasia</label>
            <input
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1"
              placeholder="Buscar por nome..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-zinc-300">CNPJ</label>
            <input
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1"
              placeholder="Buscar por CNPJ..."
              value={filtroCnpj}
              onChange={(e) => setFiltroCnpj(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setFiltroNome("");
              setFiltroCnpj("");
              carregar(0);
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Limpar
          </button>
        </div>

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
                    {e.logradouro}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {e.bairro}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {e.cidade} - {e.uf}
                  </p>
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

      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-2 rounded bg-zinc-800 disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm text-zinc-300">
          Página {page + 1} de {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 rounded bg-zinc-800 disabled:opacity-40"
        >
          Próxima
        </button>
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
