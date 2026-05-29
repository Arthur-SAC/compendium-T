"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Tooltip({ rotulo, descricao, termoId }: { rotulo: string; descricao?: string; termoId: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <span
      data-tooltip={termoId}
      tabIndex={0}
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      onFocus={() => setAberto(true)}
      onBlur={() => setAberto(false)}
      style={{ position: "relative", borderBottom: "2px dotted var(--tooltip-linha)", color: "var(--tooltip)", fontWeight: 700, cursor: "help" }}
    >
      {rotulo}
      <AnimatePresence>
        {aberto && descricao && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute", left: "50%", bottom: "135%", transform: "translateX(-50%)",
              width: 240, background: "linear-gradient(180deg,#fbf3df,#f1e3c4)", color: "var(--tinta)",
              border: "1px solid var(--borda)", borderRadius: 10, padding: "11px 13px",
              font: "400 12px/1.5 var(--serifa)", boxShadow: "0 14px 40px rgba(0,0,0,.55)", zIndex: 50,
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
