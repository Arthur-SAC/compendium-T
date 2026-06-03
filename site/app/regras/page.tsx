import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade } from "@/lib/schema";

// Agrupamento temático das regras (ordem de exibição). Ids não listados caem em "Outras Regras".
const GRUPOS: { titulo: string; ids: string[] }[] = [
  { titulo: "Criação de Personagem", ids: ["construcao-de-personagem", "atributos", "caracteristicas-das-racas", "caracteristicas-derivadas", "evolucao-de-personagem"] },
  { titulo: "Origens & Devoção", ids: ["construcao-origens", "devocao-como-funciona"] },
  { titulo: "Perícias & Poderes", ids: ["pericias-como-funcionam", "poderes-como-funcionam"] },
  { titulo: "Equipamento", ids: ["riqueza-e-equipamento", "regras-de-armas", "regras-de-armaduras", "itens-superiores", "regras-de-itens-especiais"] },
  { titulo: "Magia", ids: ["magia-como-funciona", "caracteristicas-das-magias", "aprimoramentos-de-magia"] },
  { titulo: "Jogando & Combate", ids: ["testes-e-dificuldades", "habilidades-e-efeitos", "combate", "acoes-em-combate"] },
  { titulo: "O Mestre", ids: ["como-mestrar", "sessoes-aventuras-e-campanhas", "npcs-mestre", "ambientes-de-aventura", "tempo-entre-aventuras"] },
  { titulo: "Ameaças", ids: ["construindo-combates", "perigos", "fichas-de-npcs"] },
];

function CardRegra({ regra }: { regra: Entidade }) {
  return (
    <Link
      href={`/ficha/${regra.tipo}/${regra.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "13px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 18, letterSpacing: ".3px" }}>{regra.nome}</strong>
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{regra.resumo}</p>
      </div>
    </Link>
  );
}

export default function IndiceRegras() {
  const entidades = carregarEntidades();
  const regras = entidades.filter((e) => e.tipo === "regra-de-criacao");
  const porId = new Map(regras.map((r) => [r.id, r]));
  const usados = new Set<string>();

  const grupos = GRUPOS.map((g) => {
    const itens = g.ids.map((id) => porId.get(id)).filter(Boolean) as Entidade[];
    itens.forEach((r) => usados.add(r.id));
    return { titulo: g.titulo, itens };
  }).filter((g) => g.itens.length > 0);

  const outras = regras.filter((r) => !usados.has(r.id)).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  if (outras.length > 0) grupos.push({ titulo: "Outras Regras", itens: outras });

  return (
    <main style={{ padding: 48, maxWidth: 1480, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Regras</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
        Todas as regras do Livro Básico reunidas — da criação de personagem ao combate. {regras.length} regras.
      </p>

      {grupos.map((g) => (
        <section key={g.titulo} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--serifa)", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 14px" }}>
            {g.titulo} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({g.itens.length})</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {g.itens.map((r) => <CardRegra key={r.id} regra={r} />)}
          </div>
        </section>
      ))}
    </main>
  );
}
