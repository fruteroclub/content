# fruteroclub/content

Editorial content for **frutero.club** — bilingual (ES + EN) posts. The app
(`fruteroclub/app`) reads this repo at build time via Keystatic's GitHub reader and
publishes the posts at `/noticias`. Contributions land here anytime; the site
refreshes on its next build (the "daily edition").

---

## 🤖 Agent brief — "create an article"

**If you were handed only this repo's URL and asked to write an article, this section
is your complete brief.** Follow it end to end; the linked files are authoritative.

### 0. Shortcut

This repo ships a Claude Code skill at [`.claude/skills/hermes`](.claude/skills/hermes/SKILL.md).
If you are running Claude Code with the working directory inside a clone of this repo,
just invoke **`/hermes <source-urls>`** — it automates every step below. If the skill
isn't available, do the steps by hand.

### 1. Read the contracts first (don't work from memory)

- [`HERMES.md`](HERMES.md) — the house style + the frontmatter field guide (the full drafting contract).
- [`schema/article.ts`](schema/article.ts) — the zod **`ArticleMeta`** your frontmatter MUST satisfy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — the merge checklist a human will run on your PR.

### 2. Produce these files

```
posts/<YYYY-MM-DD-kebab-slug>/es.mdx        ← Spanish (required)
posts/<YYYY-MM-DD-kebab-slug>/en.mdx        ← English (required)
posts/<YYYY-MM-DD-kebab-slug>/cover.<ext>   ← on-page cover (portrait); set cover.src to it
posts/<YYYY-MM-DD-kebab-slug>/cover-og.<ext> ← social/OG card (landscape ~1200x630); auto-used (optional)
```

Commit cover art in the PR (web-optimized JPEG/WebP, ≤~300KB). `cover-og.*` becomes the
OG/Twitter image + JSON-LD + metadata.json image; if absent, a branded card is generated.
See `HERMES.md` → "Cover images".

- **Bilingual is mandatory** — both files, the SAME story. A post missing a locale fails CI.
- The **slug is the directory name**: date-prefixed and immutable (`2026-06-22-monad-demo-night`).
  Do NOT put `slug` or `lang` in frontmatter — they are derived from the path.

### 3. Structured metadata (frontmatter — must satisfy `ArticleMeta`)

```yaml
---
title: "…"                 # 1–120 chars, the headline (per locale)
dek: "…"                   # optional, ≤280 chars, the standfirst (per locale)
date: "YYYY-MM-DD"         # a REAL calendar date (same in both locales)
author:
  name: "…"                # non-empty
  handle: "…"              # the verifiable @handle, no leading @
category: "noticia"        # logro | evento | noticia | guia | bitacora
topic: "…"                 # short subject, e.g. Monad, CDMX, Research
accent: "magenta"          # magenta (achievement/guide/news) | green (event) | orange (mentorship) | muted
glyph: "star"              # star | hex | diamond | grid | search | bolt
collector: "001/120"       # NNN/NNN
cover:
  src: "<slug>"            # stable seed string for now (real images later)
  alt: "…"                 # REQUIRED, descriptive alt text
sourceUrls:                # full URLs you cited (default [])
  - "https://…"
---
```

### 4. Write a HUMAN article — run the **humanizer** skill (required)

Draft the body, then pass it through the **humanizer** skill so it does NOT read as
AI-generated (it strips em-dash overuse, the rule-of-three, inflated/promotional
phrasing, vague attributions, negative parallelisms, etc.). Both `es.mdx` and `en.mdx`
bodies must be humanized.

- Skill: **https://github.com/blader/humanizer**
- Install (Claude Code), if not already present:
  ```bash
  git clone https://github.com/blader/humanizer ~/.claude/skills/humanizer
  ```
  Then invoke the `humanizer` skill on each locale's body and apply its fixes.
- No humanizer available? Self-edit to the same bar: no em-dash spam, no "not only… but
  also", no three-item lists by reflex, no "plays a crucial role / stands as a testament",
  plain direct sentences.

### 5. House style (HARD RULES — full detail in `HERMES.md`)

- **Vocabulary ban:** never write `onchain`, `web3`, `crypto`, `NFT`, `blockchain`, or
  `decentralized` in the rendered copy (title/dek/body). Lead with **verifiable /
  verificable**. Chain/product names (Monad, Base, …) are fine.
- **ES-first**, editorial not promotional, lead don't bury.
- **Citations:** link + summarize, NEVER copy; list sources in `sourceUrls[]`; check the
  URL isn't already cited elsewhere (`grep -rn "<url>" posts/`).
- **Browse sources** with a real browser tool (e.g. the gstack `/browse` skill), not raw `fetch`.

### 6. Validate, then open a PR (never merge)

```bash
bun install          # first run
bun run validate     # schema + bilingual + unique slug + real calendar date — must be GREEN

git checkout -b post/<slug>
git add posts/<slug>
git commit -m "post: <short title> (ES+EN)"
git push -u origin post/<slug>
gh pr create --base main --title "post: <short title> (ES+EN)" --body "Source URLs + one-line summary. Hermes draft for human merge."
```

CI (`.github/workflows/validate.yml`) runs on the PR. A human applies `CONTRIBUTING.md`
and merges — **you do not merge**. The post goes live at the next site build.

---

## How content ships to the site

`fruteroclub/app` reads this repo (`@main`) at **build time** via the Keystatic GitHub
reader (needs a `GITHUB_TOKEN` with read access; build-only). Posts are prerendered to
static HTML at `/noticias/<slug>` (ES + EN), with `NewsArticle` JSON-LD, an OG card, a
`metadata.json` (ERC-721-shaped), sitemap + hreflang, and `llms.txt`. Merging a post does
NOT auto-publish — it appears on the next app build / daily edition.

## Repo layout

```
schema/article.ts                zod ArticleMeta (the source of truth) + toErc721
scripts/validate.ts              the CI gate (bun run validate)
posts/<slug>/{es,en}.mdx          the articles
HERMES.md                        drafting contract (house style + field guide)
CONTRIBUTING.md                  human merge checklist
.claude/skills/hermes/           the /hermes Claude Code skill (automates the brief above)
.github/workflows/validate.yml   PR + push CI gate
```

## Local validation

```bash
bun install
bun run validate
```
