# Weverton Costa · Portfólio

Portfólio de **Weverton Costa**, Desenvolvedor Front-end & UI Designer em São Paulo.

**[wevertoncosta-portfolio.vercel.app](https://wevertoncosta-portfolio.vercel.app/)**

![Prévia do portfólio](assets/img/og-image.jpg)

## Destaques

| Lighthouse (mobile) | Desempenho | Acessibilidade | Boas práticas | SEO |
| --- | :---: | :---: | :---: | :---: |
| Home | 97 | 100 | 100 | 100 |
| Página de case | 99 | 100 | 100 | 100 |

<sub>Medido em out/2026. CLS ≈ 0 e Total Blocking Time de 0 ms.</sub>

- **Sem frameworks**: HTML semântico, CSS e JavaScript (ES modules), sem dependências em produção.
- **Performance**: imagens WebP responsivas (`srcset`/`sizes`), LCP pré-carregado com `fetchpriority`, fontes WOFF2 com `font-display: swap`, CSS em um único arquivo minificado e animação de fundo apenas com `transform`.
- **Acessibilidade**: skip link, foco visível, hierarquia de títulos correta, textos alternativos, links externos anunciados para leitores de tela e suporte a `prefers-reduced-motion`.
- **SEO**: metatags Open Graph/Twitter com imagem própria, canonical e dados estruturados `Person` (JSON-LD).

## Estrutura

```
├── index.html               # Home
├── projetos/<slug>/         # Páginas de case (ANAC, Soul Hara, Kérastase, W.E.R.)
├── assets/
│   ├── css/                 # Fontes do CSS, organizadas por seção (BEM)
│   │   ├── style.css        # Entrada da home (só @imports)
│   │   ├── case.css         # Estilos das páginas de case
│   │   └── *.min.css        # Gerados pelo build, não editar
│   ├── js/                  # Módulos: header fixo, menu mobile, reveal e tilt
│   ├── img/                 # Imagens (WebP)
│   └── curriculo-weverton-costa.pdf
├── scripts/build-css.mjs    # Junta os @imports e minifica o CSS
└── vercel.json              # Cache dos assets e URLs limpas
```

## Rodando localmente

```bash
# qualquer servidor estático serve
python -m http.server 8000
# abra http://localhost:8000
```

## Editando o CSS

O HTML carrega `style.min.css` e `case.min.css`. Depois de alterar qualquer arquivo em `assets/css/`, gere os arquivos de novo:

```bash
npm run build:css
```

O script não tem dependências. Ele resolve os `@import`, corrige os caminhos de `url()` e minifica o resultado.

## Contato

[LinkedIn](https://www.linkedin.com/in/weverton-costa/) · [wevertoncosta.dev@gmail.com](mailto:wevertoncosta.dev@gmail.com)
