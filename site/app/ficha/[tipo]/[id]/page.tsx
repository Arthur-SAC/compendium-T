import { notFound } from "next/navigation";
import { carregarEntidades, carregarTermos } from "@/lib/dados";
import { construirRegistro } from "@/lib/autolink";
import { Ficha } from "@/components/Ficha";
import { FichaRaca } from "@/components/FichaRaca";
import { FichaClasse } from "@/components/FichaClasse";
import { FichaOrigem } from "@/components/FichaOrigem";
import { FichaPericia } from "@/components/FichaPericia";

export const dynamicParams = false;

export function generateStaticParams() {
  return carregarEntidades().map((e) => ({ tipo: e.tipo, id: e.id }));
}

export default async function PaginaFicha({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = await params;
  const entidades = carregarEntidades();
  const termos = carregarTermos();
  const entidade = entidades.find((e) => e.id === id && e.tipo === tipo);
  if (!entidade) notFound();

  const registro = construirRegistro({
    termos: termos.map((t) => ({ id: t.id, nome: t.nome, descricao: t.descricao })),
    entidades: entidades.map((e) => ({ id: e.id, nome: e.nome, tipo: e.tipo })),
  });
  const descricoes = Object.fromEntries(termos.map((t) => [t.id, t.descricao]));

  return (
    <main style={{ padding: 40 }}>
      {entidade.tipo === "raca" ? (
        <FichaRaca entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "classe" ? (
        <FichaClasse entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "origem" ? (
        <FichaOrigem entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "pericia" ? (
        <FichaPericia entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : (
        <Ficha entidade={entidade} registro={registro} descricoes={descricoes} />
      )}
    </main>
  );
}
