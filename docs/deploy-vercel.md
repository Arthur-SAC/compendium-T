# Publicar na Vercel

O site é um app **Next.js 16** (export estático, `output: "export"`) na pasta `site/`.
A Vercel detecta o Next.js sozinho; o único ajuste necessário é apontar a **pasta raiz** para `site/`.

## Passo a passo (uma vez)

1. Acesse **https://vercel.com** e faça login com a conta do **GitHub** (Arthur-SAC).
2. **Add New… → Project** e importe o repositório **`compendium-T`**.
3. Na tela de configuração, em **Root Directory**, clique em **Edit** e selecione a pasta **`site`**.
   - Isso é essencial: o app Next está em `site/`, não na raiz do repo.
4. **Framework Preset**: `Next.js` (detectado automaticamente). Deixe Build Command e Output Directory no padrão — a Vercel reconhece o `output: "export"` e serve o site estático.
5. Clique em **Deploy**. Em ~1 minuto sai uma URL do tipo `https://compendium-t-xxxx.vercel.app`.

## Depois

- **Deploy automático:** todo `git push` para a branch `main` re-publica o site sozinho.
- **Domínio próprio (opcional):** Project → Settings → Domains.
- **Privacidade:** o deploy da Vercel é público por padrão (qualquer um com a URL acessa). Para proteção,
  a Vercel oferece "Deployment Protection" (senha/SSO) nos planos pagos.

## Notas

- Os **PDFs** dos livros **não** vão para o repositório (gitignored) — o site usa apenas os JSON em `data/`
  e as imagens em `site/public/`.
- O build local é o mesmo da Vercel: `cd site && npm install && npm run build` (gera `site/out/`).
- Conteúdo de Tormenta 20 é de propriedade da Jambô Editora; um deploy público disponibiliza esse conteúdo
  abertamente. Avalie se prefere manter privado.
