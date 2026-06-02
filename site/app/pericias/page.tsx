import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { PericiaMecanica } from "@/lib/schema";

// Escudo → penalidade de armadura. Livro aberto → somente treinada.
function IconeArmadura() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" />
    </svg>
  );
}
function IconeTreinada() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h6a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H4z" />
      <path d="M20 4h-6a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6H20z" />
    </svg>
  );
}
function Selo({ tipo }: { tipo: "treinada" | "armadura" }) {
  const cfg =
    tipo === "treinada"
      ? { cor: "var(--carmesim)", titulo: "Somente treinada: você precisa ter treinamento para usar esta perícia.", Icone: IconeTreinada }
      : { cor: "#5f7280", titulo: "Penalidade de armadura: testes sofrem redução ao usar armadura ou escudo.", Icone: IconeArmadura };
  const Icone = cfg.Icone;
  return (
    <span title={cfg.titulo} aria-label={cfg.titulo} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, border: "1px solid var(--borda)", background: "var(--pergaminho-stat)", color: cfg.cor }}>
      <Icone />
    </span>
  );
}

export default function IndicePericias() {
  const entidades = carregarEntidades();
  const pericias = entidades
    .filter((e) => e.tipo === "pericia")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const regra = entidades.find((e) => e.id === "pericias-como-funcionam");

  return (
    <main style={{ padding: 48, maxWidth: 1480, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Perícias</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
        {pericias.length} {pericias.length === 1 ? "perícia" : "perícias"} do Livro Básico
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", margin: "0 0 24px", fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--texto-casca-suave)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Selo tipo="treinada" /> Somente treinada</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Selo tipo="armadura" /> Penalidade de armadura</span>
      </div>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funcionam as Perícias</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>Seu <strong style={{ color: "var(--carmesim)" }}>valor de perícia</strong> é metade do nível + atributo-chave + bônus de treinamento (+2/+4/+6).</li>
            <li>Algumas perícias são <strong style={{ color: "var(--carmesim)" }}>somente treinadas</strong> — você precisa ter treinamento para usá-las.</li>
            <li>Perícias com <strong style={{ color: "var(--carmesim)" }}>penalidade de armadura</strong> têm redução nos testes ao usar armadura ou escudo.</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas das Perícias →
          </Link>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {pericias.map((p) => {
          const m = p.mecanica as unknown as PericiaMecanica;
          return (
            <Link
              key={p.id}
              href={`/ficha/pericia/${p.id}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
            >
              <div style={{ padding: "14px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 22, letterSpacing: ".5px" }}>{p.nome}</strong>
                  {(m.treinada || m.penalidadeArmadura) && (
                    <span style={{ display: "inline-flex", gap: 4, flexShrink: 0 }}>
                      {m.treinada && <Selo tipo="treinada" />}
                      {m.penalidadeArmadura && <Selo tipo="armadura" />}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{m.atributoChave}</p>
                {p.resumo && (
                  <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{p.resumo}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
