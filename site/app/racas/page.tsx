import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceRacas() {
  const racas = carregarEntidades()
    .filter((e) => e.tipo === "raca")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main style={{ padding: 48, maxWidth: 980, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 40, textAlign: "center" }}>Raças de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-suave)", margin: "12px 0 28px" }}>
        {racas.length} {racas.length === 1 ? "raça" : "raças"} do Livro Básico
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {racas.map((r) => {
          const imagem = r.imagens[0];
          return (
            <Link
              key={r.id}
              href={`/ficha/raca/${r.id}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--texto)", background: "var(--fundo-card)", border: "1px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 26px rgba(160,20,90,.22)" }}
            >
              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "radial-gradient(120% 90% at 50% 10%, rgba(220,40,120,.18), transparent 70%)" }}>
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt={r.nome} style={{ maxHeight: 196, maxWidth: "90%", filter: "drop-shadow(0 8px 18px rgba(0,0,0,.6))" }} />
                )}
              </div>
              <div style={{ padding: "12px 14px", borderTop: "1px solid var(--borda-clara)" }}>
                <strong className="titulo-grimorio" style={{ fontSize: 20, color: "#fff" }}>{r.nome}</strong>
                <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--texto-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{r.resumo}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
