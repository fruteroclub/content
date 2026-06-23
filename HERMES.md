# HERMES — house style & drafting contract

Hermes is the agent that drafts editorial posts for frutero.club from URLs + notes.
Every draft is a **proposal**: it opens a PR (or a `/keystatic` edit) and a human merges
it. Hermes never publishes. This file is the contract Hermes (and any human editor)
follows; `CONTRIBUTING.md` is the merge checklist the reviewer runs.

## The deliverable: TWO `.mdx` files per post

```
posts/<YYYY-MM-DD-kebab-slug>/es.mdx   ← Spanish (required)
posts/<YYYY-MM-DD-kebab-slug>/en.mdx   ← English (required)
```

- **Bilingual is mandatory.** A post missing either locale fails CI and never publishes.
  ES and EN share the directory (the slug); they are the SAME story in two languages,
  not two different posts.
- **The slug is the directory name**, date-prefixed and immutable (`2026-06-22-monad-demo-night`).
  It is NOT in the frontmatter. A title change is fine; the slug never changes.
- Frontmatter carries everything else; the markdown body is the article.

## Frontmatter field guide (must satisfy `schema/article.ts` `ArticleMeta`)

| field | rule |
|---|---|
| `title` | 1–120 chars. The headline. Per-locale. |
| `dek` | optional, ≤280 chars. The standfirst/subhead. Per-locale. |
| `date` | `YYYY-MM-DD`, a real calendar date. Same in both locales. |
| `author` | `{ name, handle }` — both non-empty. `handle` is the verifiable @handle (no `@`). |
| `category` | one of `logro \| evento \| noticia \| guia \| bitacora`. |
| `topic` | short subject string, e.g. `Monad`, `CDMX`, `Research`. |
| `accent` | `magenta` (achievements/guides/news) \| `green` (events) \| `orange` (mentorship/onboarding) \| `muted`. |
| `glyph` | one of `star \| hex \| diamond \| grid \| search \| bolt`. |
| `collector` | `NNN/NNN`, e.g. `001/120`. |
| `cover` | `{ src, alt }` — `alt` REQUIRED (accessibility). `src` is a stable seed string for now (real images later). |
| `sourceUrls` | array of full URLs you cited. Default `[]`. |

`slug` + `lang` are derived from the path — do NOT put them in frontmatter.

## House style

- **Vocabulary ban (hard rule).** Never write `onchain`, `web3`, `crypto`, `NFT`,
  `blockchain`, or `decentralized` in the rendered copy (title/dek/body) or UI. Lead with
  **"verifiable / verificable"**. Chain/product names (`Monad`, `Base`, …) are fine.
- **ES-first.** Spanish is the canonical voice; English is a faithful translation, not a
  rewrite. Keep both factually identical.
- **Editorial, not promotional.** Report what happened / what was learned. No hype, no
  investor pitch, no "revolutionary".
- **Lead, don't bury.** First sentence states the who/what. Deks ≤280 chars.
- **Headers** in the body use `##`. Bold (`**…**`) for emphasis. Plain markdown only.

## Citation rules (DEC-11)

- **Link + summarize, NEVER copy.** Paraphrase sources in your own words. No block quotes
  longer than one sentence; no lifted paragraphs.
- Every external claim's source goes in `sourceUrls[]` (full URL).
- **Dup-URL check:** before adding a URL, confirm it is not already cited in another post.
  Two posts must not be near-duplicates of the same source — consolidate or angle differently.
- Attribute people by name + handle when relevant; don't invent quotes.

## The loop

1. Receive URLs + notes.
2. Draft `es.mdx` + `en.mdx` under a new date-prefixed slug dir, conforming to the table above.
3. `bun run validate` locally (or rely on CI) — it must pass.
4. Open a PR. CI (`validate.yml`) runs on every PR: schema + bilingual + unique-slug +
   real-date. A human runs `CONTRIBUTING.md` and merges.
5. The site publishes the merged `main` at the next daily edition (00:00 UTC-6) or via a
   manual deploy-hook dispatch.
