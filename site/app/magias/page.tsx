import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, MagiaMecanica } from "@/lib/schema";

const ORDEM_CIRCULOS = [1, 2, 3, 4, 5] as const;
const ORDINAL: Record<number, string> = { 1: "1º", 2: "2º", 3: "3º", 4: "4º", 5: "5º" };

function mec(m: Entidade): MagiaMecanica {
  return m.mecanica as unknown as MagiaMecanica;
}

export default function IndiceMagias() {
  const entidades = carregarEntidades();
  const magias = entidades.filter((e) => e.tipo === "magia");
  const regra = entidades.find((e) => e.id === "magia-como-funciona");

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Magias</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
          {magias.length} magias do Livro Básico — escolha um círculo
        </p>

        {regra && (
          <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "0 0 28px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 6 }}>Como funciona a Magia</div>
            <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
              <li>Magias têm <strong style={{ color: "var(--carmesim)" }}>tipo</strong> (arcana, divina ou universal) e <strong style={{ color: "var(--carmesim)" }}>círculo</strong> (do 1º ao 5º).</li>
              <li>Lançar gasta uma <strong style={{ color: "var(--carmesim)" }}>ação</strong> e <strong style={{ color: "var(--carmesim)" }}>pontos de mana (PM)</strong> conforme o círculo.</li>
              <li>Magias podem ter <strong style={{ color: "var(--carmesim)" }}>aprimoramentos</strong> — gastar PM extra para potencializar o efeito.</li>
            </ul>
            <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--carmesim)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid var(--borda-suave)" }}>
              Ver as regras completas de Magia →
            </Link>
          </section>
        )}

        <div className="indice-lista">
          {ORDEM_CIRCULOS.map((c) => {
            const n = magias.filter((m) => mec(m).circulo === c).length;
            if (n === 0) return null;
            return (
              <Link key={c} href={`/magias/${c}`} className="indice-linha">
                <span className="indice-nome">{ORDINAL[c]} Círculo</span>
                <span className="indice-resumo">{n} {n === 1 ? "magia" : "magias"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
