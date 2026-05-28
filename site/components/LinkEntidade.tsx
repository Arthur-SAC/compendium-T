import Link from "next/link";
import type { TipoEntidade } from "@/lib/schema";

export function LinkEntidade({ alvoId, alvoTipo, rotulo }: { alvoId: string; alvoTipo: TipoEntidade; rotulo: string }) {
  return (
    <Link
      href={`/ficha/${alvoTipo}/${alvoId}`}
      style={{ color: "var(--destaque)", textDecoration: "none", borderBottom: "1px solid transparent" }}
    >
      {rotulo}
    </Link>
  );
}
