import { z } from 'zod'

export const CATEGORIES = ['logro', 'evento', 'noticia', 'guia', 'bitacora'] as const
export const ACCENTS = ['magenta', 'green', 'orange', 'muted'] as const
export const GLYPHS = ['star', 'hex', 'diamond', 'grid', 'search', 'bolt'] as const // mirror components/Glyph.tsx names

// One language version of a post. ES and EN share `slug`, differ by `lang`.
//
// NOTE (T2/T3 reconciliation, see plan §12): `slug` and `lang` are part of the
// validated object but are NOT stored in frontmatter — they are DERIVED from the
// path (directory name = slug, file name `es`/`en` = lang) by both the validate
// script and the app reader, then merged before `ArticleMeta.parse`. This upholds
// DEC-5 (the slug is the immutable directory, shared across locales) and prevents
// frontmatter/path drift; the "slug equals the directory name" check (T2) holds by
// construction. Everything else below is frontmatter.
export const ArticleMeta = z.object({
  slug: z.string().regex(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/), // DEC-5 date-prefixed, immutable
  lang: z.enum(['es', 'en']),
  title: z.string().min(1).max(120),
  dek: z.string().max(280).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.object({ name: z.string().min(1), handle: z.string().min(1) }),
  category: z.enum(CATEGORIES),
  topic: z.string().min(1),
  accent: z.enum(ACCENTS),
  glyph: z.enum(GLYPHS),
  collector: z.string().regex(/^\d{3}\/\d{3}$/), // "001/120"
  cover: z.object({ src: z.string().min(1), alt: z.string().min(1) }), // DEC-6 alt required
  sourceUrls: z.array(z.string().url()).default([]), // DEC-11
})
export type ArticleMeta = z.infer<typeof ArticleMeta>

// DEC-3: article -> ERC-721 metadata. Display traits in attributes; internal in properties.
export function toErc721(m: ArticleMeta, siteUrl: string) {
  return {
    name: m.title,
    description: m.dek ?? '',
    image: `${siteUrl}/noticias/${m.slug}/opengraph-image`,
    external_url: `${siteUrl}/noticias/${m.slug}`,
    attributes: [
      { trait_type: 'category', value: m.category },
      { trait_type: 'author', value: `@${m.author.handle}` },
      { trait_type: 'date', value: m.date, display_type: 'date' },
      { trait_type: 'lang', value: m.lang },
    ],
    properties: { slug: m.slug, source_urls: m.sourceUrls },
  }
}
