# /public/images

Drop official brand assets here before launch — logo files, real model photography,
academy/behind-the-scenes shots, and any campaign imagery. Reference them from code as
`/images/your-file.jpg`.

Until real assets are supplied, the site uses royalty-free Unsplash photography (see
`src/data/models.ts`, `src/data/programmes.ts`, and the hero sections in `src/pages/`) and a
plain text "BlackhoodAfrica" wordmark in the header/footer as a temporary logo.

**Before launch, replace:**

- All Unsplash placeholder photography with real model portfolios and academy photography.
- The temporary text logo in [Header.tsx](../../src/components/layout/Header.tsx) and
  [Footer.tsx](../../src/components/layout/Footer.tsx) with an official logo file placed here.
- [favicon.svg](../favicon.svg) with a branded favicon once a logo is finalized.
