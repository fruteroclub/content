/**
 * CI validation gate (T2). For every `posts/<slug>/`:
 *   - both `es.mdx` AND `en.mdx` must exist (bilingual required — a post missing a
 *     locale never publishes);
 *   - each file's frontmatter, MERGED with the derived `slug` (= directory name) and
 *     `lang` (= file name), must pass `ArticleMeta.parse`;
 *   - `slug` must be unique across the corpus.
 *
 * Exits non-zero on ANY failure, so a malformed OR single-locale post turns the PR
 * red before merge. (`slug`/`lang` are derived from the path, not frontmatter —
 * see schema/article.ts and plan §12.)
 */
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { ArticleMeta } from '../schema/article.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const POSTS_DIR = join(ROOT, 'posts')
const LOCALES = ['es', 'en'] as const

const errors: string[] = []
const seenSlugs = new Map<string, string>() // slug -> directory (for collision reporting)

function parseLocale(slug: string, lang: (typeof LOCALES)[number], file: string): void {
  const raw = readFileSync(file, 'utf8')
  let data: Record<string, unknown>
  try {
    data = matter(raw).data
  } catch (err) {
    errors.push(`${slug}/${lang}.mdx: invalid frontmatter — ${(err as Error).message}`)
    return
  }
  // Derive slug + lang from the path; frontmatter carries everything else.
  const result = ArticleMeta.safeParse({ ...data, slug, lang })
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${slug}/${lang}.mdx: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
    return
  }
  // The schema regex is format-only — also assert `date` is a REAL calendar date
  // (e.g. reject 2026-06-31, which would otherwise roll over to 2026-07-01 at render
  // and skew `latest()` ordering). Round-trip through Date and compare.
  const { date } = result.data
  if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    errors.push(`${slug}/${lang}.mdx: date — "${date}" is not a real calendar date`)
  }
}

function main(): void {
  if (!existsSync(POSTS_DIR)) {
    console.error(`✗ posts/ directory not found at ${POSTS_DIR}`)
    process.exit(1)
  }

  const dirs = readdirSync(POSTS_DIR).filter((name) => statSync(join(POSTS_DIR, name)).isDirectory())
  if (dirs.length === 0) errors.push('posts/ is empty — no articles to validate')

  for (const slug of dirs) {
    const prior = seenSlugs.get(slug)
    if (prior) errors.push(`slug collision: "${slug}" appears as both ${prior} and posts/${slug}`)
    seenSlugs.set(slug, `posts/${slug}`)

    const dir = join(POSTS_DIR, slug)
    for (const lang of LOCALES) {
      const file = join(dir, `${lang}.mdx`)
      if (!existsSync(file)) {
        errors.push(`${slug}: missing required locale — posts/${slug}/${lang}.mdx not found`)
        continue
      }
      parseLocale(slug, lang, file)
    }
  }

  if (errors.length > 0) {
    console.error(`✗ validate: ${errors.length} problem(s) found\n`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }
  console.log(`✓ validate: ${dirs.length} post(s) OK (ES + EN each, schema-valid, unique slugs)`)
}

main()
