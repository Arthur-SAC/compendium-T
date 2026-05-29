"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LARGURA = 240;

export function Tooltip({ rotulo, descricao, termoId }: { rotulo: string; descricao?: string; termoId: string }) {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; acima: boolean } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  function abrir() {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      // centraliza no gatilho, mas mantém dentro da viewport (margem de 8px)
      const left = Math.max(8, Math.min(r.left + r.width / 2 - LARGURA / 2, window.innerWidth - LARGURA - 8));
      // acima do gatilho por padrão; se houver pouco espaço no topo, mostra abaixo
      const acima = r.top > 160;
      const top = acima ? r.top - 8 : r.bottom + 8;
      setPos({ left, top, acima });
    }
    setAberto(true);
  }

  return (
    <span
      ref={ref}
      data-tooltip={termoId}
      tabIndex={0}
      onMouseEnter={abrir}
      onMouseLeave={() => setAberto(false)}
      onFocus={abrir}
      onBlur={() => setAberto(false)}
      style={{ borderBottom: "2px dotted var(--tooltip-linha)", color: "var(--tooltip)", fontWeight: 700, cursor: "help" }}
    >
      {rotulo}
      <AnimatePresence>
        {aberto && descricao && pos && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: pos.acima ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: pos.acima ? 6 : -6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              transform: pos.acima ? "translateY(-100%)" : "none",
              width: LARGURA,
              background: "linear-gradient(180deg,#fbf3df,#f1e3c4)",
              color: "var(--tinta)",
              border: "1px solid var(--borda)",
              borderRadius: 10,
              padding: "11px 13px",
              font: "400 12px/1.5 var(--serifa)",
              boxShadow: "0 14px 40px rgba(0,0,0,.55)",
              zIndex: 100,
              pointerEvents: "none",
            }}
          >
            <b style={{ color: "var(--carmesim)" }}>{rotulo}</b>
            <br />
            {descricao}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
