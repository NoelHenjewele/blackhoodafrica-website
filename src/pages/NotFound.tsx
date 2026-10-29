import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 pt-20 text-center">
      <div>
        <p className="font-display text-7xl text-gold lining-nums">404</p>
        <h1 className="mt-4 font-display text-4xl">This page isn't on the board.</h1>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory">
          Back to home →
        </Link>
      </div>
    </section>
  )
}
