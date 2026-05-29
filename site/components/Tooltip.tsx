"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LARGURA = 240;

// Garante apenas UM tooltip aberto por vez (evita "rastro" ao varrer várias palavras rápido).
let ativo: { fechar: () => void } | null = null;

export function Tooltip({ rotulo, descricao, termoId }: { rotulo: string; descricao?: string; termoId: string }) {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const self = useRef<{ fechar: () => void }>({ fechar: () => {} });

  function cancelar() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }
  // identidade estável; mantém a referência ao último setAberto/cancelar
  self.current.fechar = () => {
    cancelar();
    setAberto(false);
    if (ativo === self.current) ativo = null;
  };
  function agendarFechar() {
    cancelar();
    timer.current = setTimeout(() => self.current.fechar(), 160);
  }
  useEffect(() => cancelar, []);

  function abrir(e: React.MouseEvent | React.FocusEvent) {
    if (ativo && ativo !== self.current) ativo.fechar(); // fecha o anterior na hora
    ativo = self.current;
    cancelar();
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      // âncora horizontal no CURSOR (centrado nele); no foco por teclado, usa o centro do termo
      const cx = "clientX" in e ? e.clientX : r.left + r.width / 2;
      const left = Math.max(8, Math.min(cx - LARGURA / 2, vw - LARGURA - 8));
      setPos({ left, top: r.top - 2 });
    }
    setAberto(true);
  }

  return (
    <span
      ref={ref}
      data-tooltip={termoId}
      tabIndex={0}
      onMouseEnter={abrir}
      onMouseLeave={agendarFechar}
      onFocus={abrir}
      onBlur={agendarFechar}
      style={{ borderBottom: "2px dotted var(--tooltip-linha)", color: "var(--tooltip)", fontWeight: 700, cursor: "help" }}
    >
      {rotulo}
      <AnimatePresence>
        {aberto && descricao && pos && (
          <motion.span
            role="tooltip"
            onMouseEnter={cancelar}
            onMouseLeave={agendarFechar}
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
