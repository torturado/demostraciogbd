import Link from "next/link"

const sections = [
  {
    title: "Insertar dades",
    description:
      "Formulari per donar d'alta clients, productes o reserves en la base de dades.",
    href: "/insert",
  },
  {
    title: "Consultes SQL",
    description:
      "Executa consultas SELECT predefinides i visualitza els resultats en taules dinàmiques.",
    href: "/queries",
  },
  {
    title: "Informació",
    description:
      "Resum de les entitats, relacions i necessitats del sistema Ñam Ñam.",
    href: "/info",
  },
  {
    title: "Visualitzar dades",
    description:
      "Panell amb taules estilitzades per revisar categories, productes, clients i comandes existents.",
    href: "/datos",
  },
]

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <p className="text-sm uppercase tracking-wide text-red-500">Cas Pràctic 1</p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-100 md:text-5xl">
          Demostració base de dades · Restaurant Ñam Ñam
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-300">
          Explora com insertar informació, consultar dades rellevants i comprendre la
          estructura de la base de dades creada per al restaurant Ñam Ñam.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.title} href={section.href} className="group relative block h-full lg:col-span-2">
            <div className="uiverse-card">
              <div className="uiverse-card__blob" aria-hidden />
              <div className="uiverse-card__bg" aria-hidden />
              <div className="uiverse-card__content">
                <h2 className="text-xl font-semibold text-stone-100 transition-colors duration-300 group-hover:text-red-400">
                  {section.title}
                </h2>
                <p className="text-sm text-stone-300/90">{section.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-red-400 transition-transform duration-300 group-hover:translate-x-1">
                  Accedir
                  <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
