const sections = [
  {
    heading: "Necessitat d'enregistrament i entitats involucrades",
    body: (
      <p className="text-stone-300">
        El restaurant Ñam Ñam necessita digitalitzar la gestió de clients, reserves i comandes per
        donar resposta a l&apos;auge del servei a domicili. Per això definim entitats per a
        <strong> Client</strong>, <strong> Categoria</strong>, <strong> Producte</strong>,
        <strong> Comanda</strong>, <strong> Detall de comanda</strong> i <strong> Reserva</strong>,
        cadascuna amb les relacions i restriccions necessàries per garantir la traçabilitat de les
        operacions.
      </p>
    ),
  },
  {
    heading: "Relacions i esquema",
    body: (
      <p className="text-stone-300">
        El model conceptual s&apos;ha creat amb dbdiagram i després s&apos;ha traduït a Prisma. Un client pot
        tenir múltiples reserves i múltiples comandes; cada comanda es desglossa en línies a
        <em>detall_pedido</em>. Els productes depenen d&apos;una categoria i compartim claus foranes per
        mantenir la integritat entre totes les taules. Prisma genera el client TypeScript i aplica les
        migracions MySQL en base al fitxer <code className="rounded bg-stone-800 px-2 py-1 text-xs">schema.prisma</code>.
      </p>
    ),
  },
  {
    heading: "Inserció de dades",
    body: (
      <p className="text-stone-300">
        La secció d&apos;inserció disposa de formularis independents per a categories, clients, productes,
        reserves i comandes amb el seu detall. Cada formulari envia les dades als endpoints
        <code className="rounded bg-stone-800 px-2 py-1 text-xs">/api/insert-*</code>, on Prisma
        valida i crea els registres corresponents. D&apos;aquesta manera es pot mostrar com es propaguen les
        dades entre taules relacionades en temps real.
      </p>
    ),
  },
  {
    heading: "Consultes destacades",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-stone-300">
        <li>
          <strong>Clients i reserves:</strong> visualitza les reserves actives amb número de persones i
          estat.
        </li>
        <li>
          <strong>Categories i productes:</strong> mostra quants articles hi ha per categoria i quins
          estan disponibles.
        </li>
        <li>
          <strong>Comandes i detall:</strong> resumeix el total per comanda i permet aprofundir al
          detall de cada línia per veure quantitats i subtotals.
        </li>
      </ul>
    ),
  },
  {
    heading: "Visualització interactiva",
    body: (
      <p className="text-stone-300">
        La pestanya <strong>Visualitzar dades</strong> consolida totes les taules en un sol dashboard
        perquè l&apos;equip tingui context a l&apos;hora d&apos;introduir nova informació o preparar demostracions.
        Les taules utilitzen el component <code className="rounded bg-stone-800 px-2 py-1 text-xs">QueryResultTable</code>
        per formatar valors, decimals i dates de manera consistent.
      </p>
    ),
  },
  {
    heading: "Conclusions",
    body: (
      <p className="text-stone-300">
        Amb aquesta demo expliquem el cicle complet: modelatge, migració, inserció i consulta de dades,
        afegint també una vista de lectura per comprovar els resultats. És un punt de partida sòlid per
        iterar noves funcionalitats o integrar la base de dades en un projecte productiu.
      </p>
    ),
  },
  {
    heading: "Menció honorífica",
    body: (
      <p className="text-stone-300">
        Menció especial a <strong>ChatGPT Codex</strong> per fer el disseny d&apos;aquesta demostració web.
      </p>
    ),
  },
  {
    heading: "Webgrafia / Infografia",
    body: (
      <div className="space-y-3 text-stone-300">
        <a
          className="block text-red-500 hover:text-red-400"
          href="https://www.ibm.com/docs/es/imdm/11.6.0?topic=concepts-key-entity-attribute-entity-type"
          target="_blank"
          rel="noreferrer"
        >
          IBM: Key entity, attribute, entity type
        </a>
        <a
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400"
          href="https://github.com/torturado/demostraciogbd"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <span className="font-medium">Repositori a GitHub</span>
        </a>
      </div>
    ),
  },
]

export const metadata = {
  title: "Informació del sistema · Ñam Ñam",
}

export default function InfoPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-stone-100">Documentació de la base de dades</h1>
        <p className="max-w-3xl text-stone-300">
          Resum del projecte Cas Pràctic 1: objectiu del sistema, entitats i relacions, procés
          d&apos;inserció i consultes de suport per a la gestió del restaurant Ñam Ñam.
        </p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <article key={section.heading} className="card space-y-3">
            <h2 className="text-2xl font-semibold text-red-500">{section.heading}</h2>
            {section.body}
          </article>
        ))}
      </div>
    </div>
  )
}
