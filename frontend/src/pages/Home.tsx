export default function Home() {
  return (
    <div className="relative overflow-hidden">
      
        <div className="absolute inset-0 bg-gradiente-to-br from-zinc-950 via-black/85 to-purple-950/60" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-10">
            <section className="space-y-6">
              <h1 className="text-3xl md-text-w-5-xl font-semibold text-white">
                "Bem-vindo ao GestãoCorp 👋"
              </h1>
              <p className="text-zinc-300 text-base md:text max-w-2xl">
              Centralize o cadastro de empresas, mantenha fornecedores organizados e gerencie vinculos com clareza e segurança.
              </p>
              <p className="text-sm text-zinc-400">
              Use o menu superior para navegar entre as seções.
              </p>
            </section>
          </div>
    </div>
  );
}
