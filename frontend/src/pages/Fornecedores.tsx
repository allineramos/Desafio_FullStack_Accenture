import { useEffect, useRef, useState } from "react";
import { fornecedorApi } from "../api/fornecedorApi";
import type { FornecedorResponse } from "../types";
import FornecedoresForm from "./FornecedoresForm";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<FornecedorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpfCnpj, setFiltroCpfCnpj] = useState("");

  const [abrirForm, setAbrirForm] = useState(false);
  const [editando, setEditando] = useState<FornecedorResponse | null>(null);

  // guardamos um timer entre digitações
  const debounceRef = useRef<number | null>(null);

  async function carregar(nome?: string, cpfCnpj?: string) {
    try {
      setLoading(true);
      setErro(null);
      const data = await fornecedorApi.listar(nome, cpfCnpj);
      setFornecedores(data);
    } catch (e: any) {
      setErro("Erro ao carregar fornecedores");
    } finally {
      setLoading(false);
    }
  }

  // primeira carga sem filtro
  useEffect(() => {
    carregar();
  }, []);

  // 🔥 debounce: toda vez que filtro mudar, espera 400ms e busca
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const nome = filtroNome.trim();
      const cpf = filtroCpfCnpj.trim();

      // se ambos vazios, lista tudo
      if (!nome && !cpf) {
        carregar();
        return;
      }

      carregar(nome, cpf);
    }, 400);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [filtroNome, filtroCpfCnpj]);

  function onNovo() {
    setEditando(null);
    setAbrirForm(true);
  }

  function onEditar(f: FornecedorResponse) {
    setEditando(f);
    setAbrirForm(true);
  }

  async function onDeletar(id: number) {
    if (!confirm("Deseja desativar este fornecedor?")) return;
    await fornecedorApi.deletar(id);
    // recarrega respeitando filtros atuais
    const nome = filtroNome.trim();
    const cpf = filtroCpfCnpj.trim();
    carregar(nome || undefined, cpf || undefined);
  }

  function limparFiltro() {
    setFiltroNome("");
    setFiltroCpfCnpj("");
    // não precisa chamar carregar() aqui porque o useEffect já vai disparar
  }

  const fornecedoresOrdenados = [...fornecedores].sort((a, b) =>
  a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
);


  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-bold">Fornecedores</h2>
        <button
          onClick={onNovo}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
        >
          + Novo fornecedor
        </button>
      </header>

      {/* filtros (auto-search) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="text-sm text-zinc-300">Nome</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1"
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm text-zinc-300">CPF/CNPJ</label>
          <input
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1"
            placeholder="Buscar por CPF/CNPJ..."
            value={filtroCpfCnpj}
            onChange={(e) => setFiltroCpfCnpj(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={limparFiltro}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Limpar
          </button>
        </div>
      </div>

      {loading && <p className="text-zinc-300">Carregando...</p>}
      {erro && <p className="text-red-400">{erro}</p>}

      {!loading && fornecedores.length === 0 && (
        <p className="text-zinc-400">Nenhum fornecedor encontrado.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {fornecedoresOrdenados.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold text-lg">{f.nome}</p>
                <p className="text-sm text-zinc-400">
                  {f.tipoPessoa} • {f.cpfCnpj}
                </p>
                <p className="text-sm text-zinc-400">Email: {f.email}</p>
                <p className="text-sm text-zinc-400">Telefone: {f.telefone}</p>
                <p className="text-sm text-zinc-400">
                  {f.cidade} - {f.uf}
                </p>

                {f.tipoPessoa === "PF" && f.dataNascimento && (
                  <p className="text-sm text-zinc-400">
                    RG: {f.rg} • Nasc.: {f.dataNascimento}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEditar(f)}
                  className="text-sm px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeletar(f.id)}
                  className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-700"
                >
                  Desativar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {abrirForm && (
        <FornecedoresForm
          fornecedor={editando}
          onClose={() => setAbrirForm(false)}
          onSaved={() => {
            setAbrirForm(false);
            const nome = filtroNome.trim();
            const cpf = filtroCpfCnpj.trim();
            carregar(nome || undefined, cpf || undefined);
          }}
        />
      )}
    </div>
  );
}
