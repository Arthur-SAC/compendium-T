import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceClasses() {
  const classes = carregarEntidades()
    .filter((e) => e.tipo === "classe")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main style={{ padding: 48, maxWidth: 980, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Classes de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
        {classes.length} {classes.length === 1 ? "classe" : "classes"} do Livro Básico
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {classes.map((r) => {
          const imagem = r.imagens[0];
          return (
            <Link
              key={r.id}
              href={`/ficha/classe/${r.id}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
            >
              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "radial-gradient(120% 90% at 50% 10%, rgba(155,28,46,.10), transparent 70%)" }}>
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt={r.nome} style={{ maxHeight: 196, maxWidth: "90%", filter: "drop-shadow(0 8px 16px rgba(60,30,10,.45))" }} />
                )}
              </div>
              <div style={{ padding: "12px 14px", borderTop: "1px solid var(--borda)" }}>
                <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 22, letterSpacing: ".5px" }}>{r.nome}</strong>
                <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{r.resumo}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
