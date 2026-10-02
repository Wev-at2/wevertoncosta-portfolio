# Portfolio v2: estratégia de redesign

> Princípio herdado da Wisionary Lab: **"antes de você dizer uma palavra, o cliente já decidiu."**
> O portfólio deixa de ser um arquivo de projetos e passa a ser um funil cujo único objetivo é gerar uma conversa
> (vaga ou projeto) com quem decide.

---

## 1. Arquitetura da informação da home

Cada bloco responde a uma pergunta do visitante, na ordem em que ela surge na cabeça de um recrutador ou cliente.

| # | Seção | Pergunta que responde | Tempo-alvo |
|---|-------|-----------------------|------------|
| 00 | **Hero** | "Quem é e por que devo continuar?" | 0–5 s |
| 00b | **Marquee de marcas** | "Alguém sério já confiou nele?" | 5–8 s |
| 01 | **Cases** (Wisionary em destaque + grid + labs) | "Ele entrega o nível que eu preciso?" | 8–60 s |
| 02 | **Capacidades + números** | "O que exatamente ele faz?" | — |
| 03 | **Processo** | "Como seria trabalhar com ele?" | — |
| 04 | **Experiência + CV** | "Onde isso foi testado?" (filtro de RH) | — |
| 05 | **Sobre** | "Tem fit com o time?" | — |
| 06 | **Contato** | "Qual o próximo passo?" | — |

**Regras dos primeiros 5 segundos (tudo dentro da primeira dobra):**
1. **Posicionamento numa frase**: "Interfaces que decidem antes do clique."
2. **Categoria profissional explícita**: "Front-end & Creative Developer · São Paulo".
3. **Prova imediata**: linha de metadados (anos, marcas, plataformas, stack).
4. **Uma ação primária**: "Ver case Wisionary Lab". A secundária é "Falar comigo".
5. **Sinal de competência técnica**: a cena 3D *é* a demonstração, mas carrega depois do texto (o LCP é o H1).

**O que saiu e por quê**
- Parede de logos de tecnologia → virou chips dentro de cada capacidade (stack com contexto vale mais que lista).
- Carrossel Swiper → grid editorial (carrosséis escondem conteúdo; o recrutador não clica na seta).
- "Leia mais…" no Sobre → texto curto e direto, sem conteúdo escondido.
- jQuery, Slick, ScrollReveal, GSAP e Swiper → removidos da home (cerca de 350 KB de JS minificado a menos).

---

## 2. Identidade visual: "Precision Dark"

Dark mode editorial com grade técnica; o ouro funciona como **sinal**, não como decoração.

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary-color` | `#daa520` | **Mantido da v1.** Só para ênfase: CTA, palavra-chave do título, índice de seção, foco |
| `--bg` | `#07080b` | Fundo base (preto quente, não `#000`) |
| `--bg-elev` | `#0d0f14` | Cards e superfícies |
| `--navy` | `#0e1e5b` | Herança da v1, apenas no glow de profundidade do topo |
| `--text` / `--text-muted` | `#ece8df` / `#8d919b` | Texto quente / secundário |
| Display | Monument Extended (local) | Títulos em caixa alta |
| Corpo | Inter | Leitura |
| Mono | JetBrains Mono | Labels, metadados, botões: a "voz técnica" |

**Regra de proporção:** no máximo 5% da área visível em ouro por viewport. Quando tudo é dourado, nada se destaca.

### Microinterações implementadas (`assets/js/v2/app.js`)

| Interação | Técnica | Por que existe |
|-----------|---------|----------------|
| Reveal palavra a palavra nos títulos | `[data-split]` + IntersectionObserver + `transform` | Ritmo de leitura; mantém `aria-label` com o texto original |
| Cena 3D do hero | Three.js via `import()` após o load + idle, loop pausável | Prova técnica viva; mesmas regras do case Wisionary |
| Cursor com anel e rótulo contextual | `pointer: fine`, lerp, `[data-cursor="Ler case"]` | Indica a ação antes do clique |
| Botões magnéticos | `[data-magnetic]` | Atrai o olhar para os CTAs |
| Spotlight dourado nos cards | Variáveis CSS `--mx/--my` | Feedback de hover sem custo de layout |
| Scramble no menu | `[data-scramble]` | Assinatura "dev" discreta |
| Preview flutuante nos Labs | Imagem segue o ponteiro | Lista leve com preview sob demanda |
| Barra de progresso de scroll | `scaleX` numa única variável CSS | Orientação em páginas longas |
| Header que some ao descer | Classe via rAF | Mais área útil no mobile |
| Relógio de São Paulo | `Intl.DateTimeFormat` | Sinal de fuso para vagas internacionais |
| Copiar e-mail com toast | Clipboard API, com fallback `mailto:` | Remove fricção do contato |
| Contadores | rAF com easing | Números chamam atenção |

Tudo respeita `prefers-reduced-motion`, e o 3D também respeita `Save-Data` e redes 2G.

---

## 3. Plano de ação por fases

O código-base da v2 já está pronto. O plano abaixo cobre o que falta para publicar com qualidade, em cerca de 5–6 h por semana.

### Semana 1: conteúdo e provas
- [ ] Capturar screenshots reais da Wisionary Lab (1600×1000, WebP q80) → `assets/img/wc-projects_wisionarylab.webp`.
- [ ] Rodar PageSpeed Insights (mobile) em wisionarylab.com e **substituir as metas** da seção Resultados pelos números reais.
- [ ] Revisar cada afirmação técnica do case com o que de fato foi implementado (ex.: CPTs/ACF, Draco) e remover o que não se aplica.
- [ ] Gerar `assets/img/og-image.jpg` (1200×630) com o título do hero (hoje o arquivo não existe).

### Semana 2: copy e versão EN
- [ ] Ler a home em voz alta e cortar 20% das palavras.
- [ ] Criar `/en/` com a mesma estrutura, para vagas internacionais (hreflang pt-BR/en).
- [ ] Atualizar o LinkedIn com a mesma headline do hero (consistência de mensagem).

### Semana 3: mais um case profundo
- [ ] Escrever o case Hausport ou Kérastase no mesmo template de `cases/wisionary-lab/` (STAR).
- [ ] Na home, transformar o segundo card em "case completo".

### Semana 4: QA e deploy
- [ ] Testar em um Android intermediário real (Moto G / Galaxy A) com throttling 4G.
- [ ] Teclado: Tab por toda a página, foco visível, menu fecha com Esc.
- [ ] Lighthouse ≥ 95 em Performance, A11y e SEO.
- [ ] Merge `redesign-v2` → `main` e deploy na Vercel; conferir o domínio `wevertoncosta.dev.br`.
- [ ] Decidir o destino das páginas antigas (`links/`, `briefing/`, `business-mapping/`, `cv.html`), que ainda usam o CSS v1.

### Contínuo
- Um case novo por trimestre; os Labs são o lugar para experimentos rápidos.
- Medir cliques em "Ver case", "WhatsApp" e "Copiar e-mail" (Vercel Analytics ou Plausible).
