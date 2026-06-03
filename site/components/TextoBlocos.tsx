import { TextoRico } from "./TextoRico";
import { type Registro } from "@/lib/autolink";

type Props = { texto: string; registro: Registro; descricoes: Record<string, string> };

// Casa "Termo. descrição" (termo curto iniciando em maiúscula) → vira linha de tabela.
const RE_TERMO = /^([A-ZÀ-Ÿ][^.]{0,32})\.\s+(.+)$/;

type Bloco = { tipo: "prosa"; texto: string } | { tipo: "lista"; itens: string[] };

function montarBlocos(texto: string): Bloco[] {
  const blocos: Bloco[] = [];
  let prosa: string[] = [];
  const fecharProsa = () => {
    if (prosa.length) {
      blocos.push({ tipo: "prosa", texto: prosa.join(" ") });
      prosa = [];
    }
  };
  for (const linha of texto.split("\n")) {
    const t = linha.trim();
    if (t.startsWith("•")) {
      fecharProsa();
      const item = t.replace(/^•\s*/, "");
      const ultimo = blocos[blocos.length - 1];
      if (ultimo && ultimo.tipo === "lista") ultimo.itens.push(item);
      else blocos.push({ tipo: "lista", itens: [item] });
    } else if (t.length === 0) {
      fecharProsa();
    } else {
      prosa.push(t);
    }
  }
  fecharProsa();
  return blocos;
}

/** Renderiza o texto de uma seção em blocos: parágrafos de prosa e listas com
 *  bullets viram tabela (Termo | descrição) quando os itens têm rótulo; senão, lista comum. */
export function TextoBlocos({ texto, registro, descricoes }: Props) {
  const blocos = montarBlocos(texto);
  return (
    <>
      {blocos.map((b, i) => {
        if (b.tipo === "prosa") {
          return (
            <p key={i} style={{ margin: i === 0 ? "0 0 10px" : "10px 0" }}>
              <TextoRico texto={b.texto} registro={registro} descricoes={descricoes} />
            </p>
          );
        }
        const pares = b.itens.map((it) => {
          const m = RE_TERMO.exec(it);
          return m ? { termo: m[1], desc: m[2] } : { termo: "", desc: it };
        });
        const ehTabela = pares.filter((p) => p.termo).length >= Math.max(2, Math.ceil(pares.length / 2));
        if (ehTabela) {
          return (
            <table key={i} className="tabela-quadro">
              <tbody>
                {pares.map((p, j) => (
                  <tr key={j}>
                    <td className="tq-termo">{p.termo || "—"}</td>
                    <td><TextoRico texto={p.desc} registro={registro} descricoes={descricoes} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        return (
          <ul key={i} style={{ margin: "8px 0", paddingLeft: 20, fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
            {b.itens.map((it, j) => (
              <li key={j}><TextoRico texto={it} registro={registro} descricoes={descricoes} /></li>
            ))}
          </ul>
        );
      })}
    </>
  );
}
