import { Divisor } from "@/components/Divisor";

export default function Estilo() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 40 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 34, textAlign: "center" }}>
        Compêndio de Arton
      </h1>
      <Divisor />
      <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginTop: 20 }}>
        Vitrine do tema. Fundo, tipografia serifada e acentos em magenta da Tormenta.
      </p>
    </main>
  );
}
