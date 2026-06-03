"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { areaDoPath, regrasDaArea, rotuloRegra, CATEGORIAS, tiposDaArea, mostrarListaNaBarra } from "@/lib/navegacao";
import { BuscaCompacta } from "./BuscaCompacta";
import type { Indice } from "@/lib/busca";

/** Coluna direita: busca (topo) + regras da área + lista de entidades da seção. */
export function BarraContexto({ indice }: { indice: Indice }) {
  const pathname = usePathname() ?? "/";
  const area = areaDoPath(pathname);
  const regras = regrasDaArea(area);
  const cat = CATEGORIAS.find((c) => c.id === area);
  const rota = cat?.rota ?? "";
  const naFicha = pathname.startsWith("/ficha/");

  // Lista de entidades da seção (ex.: as classes) — só nas áreas de catálogo pequeno.
  const tipos = tiposDaArea(area);
  const lista = mostrarListaNaBarra(area)
    ? indice.filter((e) => tipos.includes(e.tipo)).slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    : [];

  return (
    <aside className="barra-contexto" aria-label="Contexto da seção">
      <BuscaCompacta indice={indice} />

      <div className="ctx-menu">
        {regras.length > 0 && (
          <>
            <div className="ctx-rotulo">Regras desta seção</div>
            {regras.map((id) => (
              <Link key={id} href={`/ficha/regra-de-criacao/${id}`} className="ctx-link ctx-link-regra">
                {rotuloRegra(id)}
              </Link>
            ))}
          </>
        )}

        {lista.length > 0 && (
          <>
            <div className="ctx-rotulo" style={{ marginTop: regras.length > 0 ? 16 : 0 }}>{cat?.rotulo ?? "Nesta seção"}</div>
            {lista.map((e) => (
              <Link key={`${e.tipo}/${e.id}`} href={`/ficha/${e.tipo}/${e.id}`} className="ctx-link">
                {e.nome}
              </Link>
            ))}
          </>
        )}

        {naFicha && rota && lista.length === 0 && (
          <Link href={rota} className="ctx-link" style={{ marginTop: 16, opacity: 0.7 }}>
            ← Voltar ao índice
          </Link>
        )}
      </div>
    </aside>
  );
}
