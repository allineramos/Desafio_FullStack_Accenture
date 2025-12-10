import { useEffect, useState, useRef } from "react";
import { fornecedorApi } from "../api/fornecedorApi";
import type { FornecedorRequest, FornecedorResponse } from "../types";

type Props = {
  fornecedor: FornecedorResponse | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function FornecedorForm({ fornecedor, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FornecedorRequest>({
    tipoPessoa: (fornecedor?.tipoPessoa as "PF" | "PJ") ?? "PJ",
    cpfCnpj: fornecedor?.cpfCnpj ?? "",
    nome: fornecedor?.nome ?? "",
    email: fornecedor?.email ?? "",
    telefone: fornecedor?.telefone ?? "",
    cep: fornecedor?.cep ?? "",
    rg: fornecedor?.rg ?? "",
    dataNascimento: fornecedor?.dataNascimento ?? "",
  });

  const [logradouro, setLogradouro] = useState(fornecedor?.logradouro ?? "");
  const [bairro, setBairro] = useState(fornecedor?.bairro ?? "");
  const [cidade, setCidade] = useState(fornecedor?.cidade ?? "");
  const [uf, setUf] = useState(fornecedor?.uf ?? "");
  const [cepError, setCepError] = useState<string | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function update<K extends keyof FornecedorRequest>(
    key: K,
    value: FornecedorRequest[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    if (form.tipoPessoa === "PJ") {
      setForm((f) => ({ ...f, rg: "", dataNascimento: "" }));
    }
  }, [form.tipoPessoa]);

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

        const res = await fornecedorApi.consultarCep(cepLimpo);

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
      setErro(null);

      if (!form.cpfCnpj || !form.nome || !form.email || !form.telefone || !form.cep) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }

      if (cepError) {
        setErro("Por favor, corrija o CEP antes de salvar.");
        return;
      }

      if (form.tipoPessoa === "PF") {
        if (!form.rg || form.rg.trim() === "") {
          setErro("RG é obrigatório para PF.");
          return;
        }
        if (!form.dataNascimento || form.dataNascimento.trim() === "") {
          setErro("Data de nascimento é obrigatória para PF.");
          return;
        }
      }

      const payload: FornecedorRequest = {
        ...form,
        cep: form.cep.replace(/\D/g, ""),
      };

      if (fornecedor) {
        await fornecedorApi.atualizar(fornecedor.id, payload);
      } else {
        await fornecedorApi.criar(payload);
      }

      onSaved();
    } catch (e: any) {
      setErro(e?.response?.data?.error ?? "Erro ao salvar fornecedor");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold">
          {fornecedor ? "Editar fornecedor" : "Novo fornecedor"}
        </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-2xl leading-none"
            aria-label="Fechar"
            title="Fechar"
          >
            ×
          </button>

        {erro && <p className="text-red-400">{erro}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update("tipoPessoa", "PF")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${
              form.tipoPessoa === "PF"
                ? "bg-purple-600"
                : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
            }`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => update("tipoPessoa", "PJ")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${
              form.tipoPessoa === "PJ"
                ? "bg-purple-600"
                : "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
            }`}
          >
            Pessoa Jurídica
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
            placeholder="CPF/CNPJ"
            value={form.cpfCnpj}
            onChange={(e) => update("cpfCnpj", e.target.value)}
          />
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
          />
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => update("telefone", e.target.value)}
          />
          <div>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
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

          {form.tipoPessoa === "PF" && (
            <>
              <input
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                placeholder="RG"
                value={form.rg ?? ""}
                onChange={(e) => update("rg", e.target.value)}
              />
              <input
                type="date"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2"
                value={form.dataNascimento ?? ""}
                onChange={(e) => update("dataNascimento", e.target.value)}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
