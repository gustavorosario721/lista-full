# Hub de Exercícios Acadêmicos

SPA de 20 exercícios de manipulação do DOM, construída com Vite, JavaScript Vanilla e Supabase.

## Requisitos

- Node.js 20.19+ ou 22.12+
- Projeto Supabase
- Tabelas `comentarios`, `candidatos` e `horarios` criadas

## Instalação

```bash
npm install
cp .env.example .env
npm run dev
```

Preencha `.env` com a URL do projeto e a chave pública (anon ou publishable):

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

Nunca use `service_role` ou secret key no frontend.

## Supabase

1. Confirme as colunas:
   - `comentarios`: `id`, `texto`, `created_at`
   - `candidatos`: `id`, `nome`, `votos`
   - `horarios`: `id`, `horario`, `reservado`, `reservado_por`
2. Execute `supabase-setup.sql` no SQL Editor, após conferir os tipos e permissões.
3. Em Authentication > URL Configuration, configure a URL local e a URL de produção.
4. Para cadastro por e-mail, ajuste a confirmação de e-mail conforme a necessidade da atividade.

**Q15:** a função RPC `increment_candidate_vote` assume que `candidatos.id` é `bigint`. Ajuste para `uuid` se necessário.

**Q18:** `reservado_por` recebe o UUID do usuário autenticado; se sua coluna tiver outro tipo, ajuste o campo no módulo ou deixe-o nulo.

**Q03:** Realtime depende de a tabela estar na publicação `supabase_realtime`.

## Build e deploy na Vercel

```bash
npm run build
```

Na Vercel:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

O `vercel.json` inclui rewrite para suportar rotas SPA.

## Organização dos módulos

Cada exercício exporta `render(root)`. O controlador importa o módulo sob demanda e pode receber uma função de limpeza para remover listeners/canais/timers quando o usuário troca de questão.

Os exercícios estáticos são exemplos didáticos com `addEventListener()`. O câmbio da Q19 usa uma cotação ilustrativa fixa de R$ 5,00 por dólar; o vídeo da Q11 é demonstrativo.