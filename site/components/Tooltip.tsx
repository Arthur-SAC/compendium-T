"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LARGURA = 240;

export function Tooltip({ rotulo, descricao, termoId }: { rotulo: string; descricao?: string; termoId: string }) {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  function abrir() {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      // ancora no termo: abre para a DIREITA (alinhado à esquerda do termo);
      // se não couber, abre para a ESQUERDA (alinhado à direita do termo)
      let left = r.left;
      if (left + LARGURA > vw - 8) left = r.right - LARGURA;
      left = Math.max(8, Math.min(left, vw - LARGURA - 8));
      // sempre acima do gatilho (pode vazar por cima)
      setPos({ left, top: r.top - 8 });
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              transform: "translateY(-100%)",
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
