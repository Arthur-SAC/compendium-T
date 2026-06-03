import { notFound } from "next/navigation";
import { carregarEntidades, carregarTermos } from "@/lib/dados";
import { construirRegistro } from "@/lib/autolink";
import { Ficha } from "@/components/Ficha";
import { FichaRaca } from "@/components/FichaRaca";
import { FichaClasse } from "@/components/FichaClasse";
import { FichaOrigem } from "@/components/FichaOrigem";
import { FichaPericia } from "@/components/FichaPericia";
import { FichaPoder } from "@/components/FichaPoder";
import { FichaItem } from "@/components/FichaItem";
import { FichaItemMagico } from "@/components/FichaItemMagico";
import { FichaMagia } from "@/components/FichaMagia";
import { FichaDivindade } from "@/components/FichaDivindade";
import { FichaCriatura } from "@/components/FichaCriatura";

export const dynamicParams = false;

export function generateStaticParams() {
  return carregarEntidades().map((e) => ({ tipo: e.tipo, id: e.id }));
}

export default async function PaginaFicha({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = await params;
  const entidades = carregarEntidades();
  const termos = carregarTermos();
  const entidadeBruta = entidades.find((e) => e.id === id && e.tipo === tipo);
  if (!entidadeBruta) notFound();

  // Só mantém relações cujo alvo realmente existe (evita links quebrados p/ conteúdo de
  // outros livros ainda não importados; voltam sozinhas quando a fonte entrar na Fase 2).
  const validos = new Set(entidades.map((e) => `${e.tipo}/${e.id}`));
  const entidade = { ...entidadeBruta, relacoes: entidadeBruta.relacoes.filter((r) => validos.has(`${r.alvoTipo}/${r.alvoId}`)) };

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
      ) : entidade.tipo === "poder" ? (
        <FichaPoder entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "item" ? (
        <FichaItem entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "item-magico" ? (
        <FichaItemMagico entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "magia" ? (
        <FichaMagia entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "divindade" ? (
        <FichaDivindade entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "criatura" ? (
        <FichaCriatura entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : (
        <Ficha entidade={entidade} registro={registro} descricoes={descricoes} />
      )}
    </main>
  );
}
