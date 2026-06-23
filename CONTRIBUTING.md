# Contributing — merge checklist

This repo is the editorial source for frutero.club. Posts are drafted by Hermes (see
`HERMES.md`) or by hand, proposed as PRs, and **a human merge is the quality gate**.
CI (`.github/workflows/validate.yml`) blocks malformed, single-locale, duplicate-slug,
or bad-date posts automatically; this checklist covers what CI cannot judge.

## Before merging a post PR (DEC-12)

- [ ] **Accuracy** — every factual claim is correct and traceable to a real source; no
      invented quotes, numbers, or events.
- [ ] **Vocabulary ban** — the rendered copy (title, dek, body) and any UI string contain
      NONE of: `onchain`, `web3`, `crypto`, `NFT`, `blockchain`, `decentralized`. It leads
      with **verifiable / verificable** where reputation/proof is the point.
- [ ] **SEO title + dek** — title ≤120 chars, states the subject; dek ≤280 chars, is a real
      standfirst (not a teaser fragment). Both read well out of context (search/social).
- [ ] **Image rights + alt** — any cover/image is ours or properly licensed; `cover.alt` is
      a real, descriptive alt text (not empty, not "image").
- [ ] **Citations** — sources are linked + summarized (never copied); `sourceUrls[]` lists
      them; no near-duplicate of an already-published post's source (dup-URL check).
- [ ] **Bilingual completeness** *(also enforced by CI)* — both `es.mdx` and `en.mdx` exist
      and tell the SAME story; no mixed-language page.
- [ ] **Schema validity** *(also enforced by CI)* — `bun run validate` is green.

## Running validation locally

```bash
bun install
bun run validate   # schema + bilingual + unique slug + real calendar date
```

A red `validate` (locally or in CI) blocks the merge. Fix the post, don't bypass the gate.
