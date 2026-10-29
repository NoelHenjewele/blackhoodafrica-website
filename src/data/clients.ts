export type Client = {
  name: string
  logo: string // path under /public, e.g. /clients/brand-name.png (dark logo on transparent background)
}

// Real, confirmed past clients only. The "Brands we've worked with" strip stays hidden while this is empty.
export const clients: Client[] = []
