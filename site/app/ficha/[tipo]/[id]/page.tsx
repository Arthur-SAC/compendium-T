import { notFound } from "next/navigation";
import { carregarEntidades, carregarTermos, tituloFonte } from "@/lib/dados";
import { construirRegistro } from "@/lib/autolink";
import { tabelaEquipamentoPipe } from "@/lib/equipamento-tabela";
import { SeloFonte } from "@/components/SeloFonte";
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
  // Marcador [[tabela-equipamento:<slug>]] numa seção → tabela dinâmica gerada das entidades item
  // (multi-fonte, auto-inclui livros futuros). Inofensivo fora das regras (nenhuma seção casa).
  const RE_MARCADOR = /^\[\[tabela-equipamento:([a-z-]+)\]\]$/;
  const secoes = entidadeBruta.secoes.map((s) => {
    const m = RE_MARCADOR.exec(s.texto.trim());
    return m ? { ...s, texto: tabelaEquipamentoPipe(m[1], entidades) } : s;
  });
  const entidade = {
    ...entidadeBruta,
    secoes,
    relacoes: entidadeBruta.relacoes.filter((r) => validos.has(`${r.alvoTipo}/${r.alvoId}`)),
  };

  const registro = construirRegistro({
    termos: termos.map((t) => ({ id: t.id, nome: t.nome, descricao: t.descricao, exigeMaiuscula: t.exigeMaiuscula })),
    entidades: entidades.map((e) => ({ id: e.id, nome: e.nome, tipo: e.tipo })),
  });
  const descricoes = Object.fromEntries(termos.map((t) => [t.id, t.descricao]));

  return (
    <main style={{ padding: 40 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto 10px", textAlign: "center" }}>
        <SeloFonte titulo={tituloFonte(entidade.fonte.livro)} />
      </div>
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
      ) : entidade.tipo === "variante-classe" ? (
        <FichaClasse entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : (
        <Ficha entidade={entidade} registro={registro} descricoes={descricoes} />
      )}
    </main>
  );
}
