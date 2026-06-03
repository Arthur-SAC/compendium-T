"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { areaDoPath, subsecoesDaArea, regrasDaArea, rotuloRegra, CATEGORIAS } from "@/lib/navegacao";
import { BuscaCompacta } from "./BuscaCompacta";
import type { Indice } from "@/lib/busca";

/** Coluna direita: busca (topo) + sub-seções da área + regras da área. */
export function BarraContexto({ indice }: { indice: Indice }) {
  const pathname = usePathname() ?? "/";
  const area = areaDoPath(pathname);
  const subsecoes = subsecoesDaArea(area);
  const regras = regrasDaArea(area);
  const rota = CATEGORIAS.find((c) => c.id === area)?.rota ?? "";
  const naFicha = pathname.startsWith("/ficha/");

  return (
    <aside className="barra-contexto" aria-label="Contexto da seção">
      <BuscaCompacta indice={indice} />

      <div className="ctx-menu">
        {subsecoes.length > 0 && (
          <>
            <div className="ctx-rotulo">Nesta seção</div>
            {subsecoes.map((s) => (
              <Link key={s.id} href={`${rota}#${s.id}`} className="ctx-link">{s.rotulo}</Link>
            ))}
          </>
        )}

        {regras.length > 0 && (
          <>
            <div className="ctx-rotulo" style={{ marginTop: subsecoes.length > 0 ? 16 : 0 }}>Regras desta seção</div>
            {regras.map((id) => (
              <Link key={id} href={`/ficha/regra-de-criacao/${id}`} className="ctx-link ctx-link-regra">
                {rotuloRegra(id)}
              </Link>
            ))}
          </>
        )}

        {naFicha && rota && (
          <Link href={rota} className="ctx-link" style={{ marginTop: 16, opacity: 0.7 }}>
            ← Voltar ao índice
          </Link>
        )}
      </div>
    </aside>
  );
}
