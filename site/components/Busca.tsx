"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buscar, type ItemIndice, type Indice } from "@/lib/busca";

export function Busca({ indice }: { indice: Indice }) {
  const [q, setQ] = useState("");
  const resultados = useMemo(() => buscar(q, indice).slice(0, 20), [q, indice]);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar em Arton…"
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--fundo-card)", border: "1px solid var(--borda-clara)", color: "var(--texto)", fontSize: 16 }}
      />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {resultados.map((r: ItemIndice, i) => (
          <motion.div key={r.tipo + r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Link href={`/ficha/${r.tipo}/${r.id}`} style={{ display: "block", padding: "10px 14px", borderRadius: 10, background: "var(--fundo-card)", border: "1px solid var(--borda)", color: "var(--texto)", textDecoration: "none" }}>
              <strong style={{ color: "var(--destaque)" }}>{r.nome}</strong>
              <span style={{ float: "right", fontSize: 10, textTransform: "uppercase", color: "var(--texto-suave)" }}>{r.tipo}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
