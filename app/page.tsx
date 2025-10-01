import Link from "next/link"

const features = [
  {
    title: "Inserir dades",
    description:
      "Formularis preparats per afegir categories, productes, clients, reserves i comandes amb validació instantània.",
    href: "/insert",
    icon: "📝",
  },
  {
    title: "Consultes SQL",
    description:
      "Executa consultes SELECT predefinides i mostra en taules els resultats per explicar joins, agregacions i filtres.",
    href: "/queries",
    icon: "📊",
  },
  {
    title: "Informació del sistema",
    description:
      "Documentació del model, entitats i fluxos perquè l&apos;equip entengui el context abans de connectar-se a la demo.",
    href: "/info",
    icon: "📚",
  },
  {
    title: "Visualitzar dades",
    description:
      "Dashboard amb totes les taules renderitzades en temps real per contrastar insercions i consultes.",
    href: "/datos",
    icon: "🗂️",
  },
] as const

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-20">
      <section className="mx-auto max-w-4xl text-center space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Cas pràctic 1
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight text-balance md:text-5xl">
            Demostració de base de dades per al restaurant <span className="text-primary">Ñam Ñam</span>
          </h1>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Explora com inserir registres, executar consultes SQL i explicar el model relacional complet utilitzant Next.js,
            Prisma i MySQL en una sola demo.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/insert" className="button-primary w-full sm:w-auto">
            Començar demo
          </Link>
          <Link
            href="/info"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:w-auto"
          >
            Veure documentació
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Què trobaràs a la demo</h2>
          <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
            Quatre apartats per mostrar el cicle complet de vida de les dades: des de la definició del model fins a la lectura
            i les consultes analítiques.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group block h-full">
              <article className="card h-full space-y-4 transition-all group-hover:border-primary/60 group-hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-primary/10 text-lg"
                  >
                    {feature.icon}
                  </span>
                  <span className="text-lg text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
                    →
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary/80 transition-colors group-hover:text-primary">
                  Accedir
                  <span aria-hidden>→</span>
                </span>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-muted space-y-4">
        <h3 className="text-base font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Stack utilitzat
        </h3>
        <p className="max-w-3xl text-sm text-muted-foreground">
          L&apos;aplicació està construïda amb Next.js (App Router), React Hook Form per als formularis, Prisma com a ORM i MySQL
          com a base de dades. Tailwind CSS 4 ens permet recrear ràpidament l&apos;estètica del projecte de referència.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {['Next.js', 'React 19', 'TypeScript', 'Prisma ORM', 'MySQL', 'Tailwind CSS 4'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/60 bg-background/70 px-3 py-2 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
