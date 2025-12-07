import { useEffect, useState, useRef } from "react";
import { empresaApi } from "../api/empresaApi";
import { fornecedorApi } from "../api/fornecedorApi";
import { vinculoApi } from "../api/vinculoApi";
import type { EmpresaResponse, FornecedorResponse } from "../types";

export default function Vinculos() {
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaResponse | null>(null);

  const [vinculados, setVinculados] = useState<FornecedorResponse[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaCpfCnpj, setBuscaCpfCnpj] = useState("");
  const [candidatos, setCandidatos] = useState<FornecedorResponse[]>([]);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const LIMITE = 10;


  useEffect(() => {
    (async () => {
      const list = await empresaApi.listar();
      setEmpresas(list);
    })();
  }, []);

useEffect(() => {
  if (!empresaSelecionada) return;

  if (debounceRef.current) window.clearTimeout(debounceRef.current);

  debounceRef.current = window.setTimeout(() => {
    const nome = buscaNome.trim();
    const cpf = buscaCpfCnpj.trim();

    if (!nome && !cpf) {
      carregarCandidatos(); 
      return;
    }

    carregarCandidatos(nome, cpf);
  }, 400);

  return () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
  };
}, [buscaNome, buscaCpfCnpj, empresaSelecionada, vinculados]);


  async function carregarVinculados(empresaId: number) {
    setLoading(true);
    setErro(null);
    try {
      const list = await vinculoApi.listarFornecedoresDaEmpresa(empresaId);
      setVinculados(list);
    } catch (e: any) {
      setErro("Erro ao carregar vínculos");
    } finally {
      setLoading(false);
    }
  }

  async function selecionarEmpresa(idStr: string) {
  const id = Number(idStr);
  if (!id) {
    setEmpresaSelecionada(null);
    setVinculados([]);
    setCandidatos([]);
    setBuscaNome("");
    setBuscaCpfCnpj("");
    return;
  }

  const e = empresas.find((x) => x.id === id) ?? null;
  setEmpresaSelecionada(e);

  if (e) {
    await carregarVinculados(e.id);
    await carregarCandidatos(); // <-- lista fornecedores disponíveis
  }
}

  async function carregarCandidatos(nome?: string, cpfCnpj?: string) {
  if (!empresaSelecionada) return;

  setLoadingBusca(true);
  setErro(null);
  try {
    const list = await fornecedorApi.listar(nome, cpfCnpj);

    const vinculadosIds = new Set(vinculados.map((v) => v.id));
    const filtrados = list.filter((f) => !vinculadosIds.has(f.id));

    setCandidatos(filtrados.slice(0, LIMITE)); // <-- limita aqui
  } catch (e: any) {
    setErro("Erro ao buscar fornecedores");
  } finally {
    setLoadingBusca(false);
  }
}



  async function vincular(fornecedorId: number) {
    if (!empresaSelecionada) return;
    setLoading(true);
    setErro(null);
    try {
      await vinculoApi.vincular(empresaSelecionada.id, fornecedorId);
      await carregarVinculados(empresaSelecionada.id);
      await carregarCandidatos();
    } catch (e: any) {
      setErro(e?.response?.data?.error ?? "Erro ao vincular fornecedor");
    } finally {
      setLoading(false);
    }
  }

  async function desvincular(fornecedorId: number) {
    if (!empresaSelecionada) return;
    if (!confirm("Deseja desvincular este fornecedor?")) return;

    setLoading(true);
    setErro(null);
    try {
      await vinculoApi.desvincular(empresaSelecionada.id, fornecedorId);
      await carregarVinculados(empresaSelecionada.id);
      await carregarCandidatos();
    } catch (e: any) {
      setErro(e?.response?.data?.error ?? "Erro ao desvincular fornecedor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Vincular Fornecedores</h2>
        <p className="text-zinc-400 text-sm">
          Selecione uma empresa e vincule/desvincule fornecedores.
        </p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
        <label className="text-sm text-zinc-300">Empresa</label>
        <select
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2"
          onChange={(e) => selecionarEmpresa(e.target.value)}
          defaultValue=""
        >
          <option value="">Selecione...</option>
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nomeFantasia} ({e.cnpj})
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="text-red-400">{erro}</p>}

      {!empresaSelecionada && (
        <p className="text-zinc-400">Escolha uma empresa para começar.</p>
      )}

      {empresaSelecionada && (
        <div className="grid md:grid-cols-2 gap-4">

          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-lg">Fornecedores vinculados</h3>

            {loading && vinculados.length === 0 && (
              <p className="text-zinc-400 text-sm">Carregando vínculos...</p>
            )}

            {vinculados.length === 0 && !loading && (
              <p className="text-zinc-400 text-sm">Nenhum fornecedor vinculado.</p>
            )}

            <div className="space-y-2">
              {vinculados.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{f.nome}</p>
                    <p className="text-xs text-zinc-400">
                      {f.tipoPessoa} • {f.cpfCnpj}
                    </p>
                  </div>
                  <button
                    onClick={() => desvincular(f.id)}
                    className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-700"
                  >
                    Desvincular
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-lg">Buscar fornecedores</h3>

            <div className="space-y-2">
              <input
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2"
                placeholder="Filtrar por nome..."
                value={buscaNome}
                onChange={(e) => {
                  setBuscaNome(e.target.value);
                  setMostrarDropdown(true);
                }}
                onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
              />

              <input
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2"
                placeholder="Filtrar por CPF/CNPJ..."
                value={buscaCpfCnpj}
                onChange={(e) => {
                  setBuscaCpfCnpj(e.target.value);
                  setMostrarDropdown(true);
                }}
                onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
              />
            </div>


            {loadingBusca && candidatos.length === 0 && (
              <p className="text-zinc-400 text-sm">Buscando fornecedores...</p>
    )}

            {!loadingBusca && candidatos.length === 0 && (
              <p className="text-zinc-400 text-sm">
                 Nenhum fornecedor encontrado.</p>
            )}

            <div className="space-y-2">
              {candidatos.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{f.nome}</p>
                    <p className="text-xs text-zinc-400">
                      {f.tipoPessoa} • {f.cpfCnpj}
                    </p>
                  </div>
                  <button
                    onClick={() => vincular(f.id)}
                    className="text-sm px-3 py-1 rounded-md bg-green-600 hover:bg-green-700"
                  >
                    Vincular
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
