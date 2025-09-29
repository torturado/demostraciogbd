import Link from "next/link"

import { InsertCategoryForm } from "@/components/InsertCategoryForm"
import { InsertClientForm } from "@/components/InsertClientForm"
import { InsertOrderForm } from "@/components/InsertOrderForm"
import { InsertProductForm } from "@/components/InsertProductForm"
import { InsertReservationForm } from "@/components/InsertReservationForm"

export const metadata = {
  title: "Inserir dades · Ñam Ñam",
}

export default function InsertPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-stone-100">Inserir registres</h1>
        <p className="max-w-3xl text-stone-300">
          Utilitza els següents formularis per inserir registres a la base de dades.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Categories</h2>
        <p className="max-w-3xl text-stone-300">
          Defineix la categoria a la qual s&apos;assignaran els productes del menú. Ajuda a mantenir la carta
          organitzada i evitar duplicacions.
        </p>
        <InsertCategoryForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Clients</h2>
        <p className="max-w-3xl text-stone-300">
          L&apos;alta de clients registra les seves dades de contacte per poder associar reserves i comandes.
        </p>
        <InsertClientForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Productes</h2>
        <p className="max-w-3xl text-stone-300">
          Afegeix articles del menú indicant el seu preu, disponibilitat i categoria. Assegura&apos;t que
          l&apos;identificador de categoria existeix prèviament a la taula <em>categoria</em> o consulta&apos;ls
          des de la pestanya
          <Link className="text-red-500 hover:text-red-400" href="/datos">
            {" "}
            Visualitzar dades
          </Link>
          .
        </p>
        <InsertProductForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Reserves</h2>
        <p className="max-w-3xl text-stone-300">
          Registra noves reserves associant-les a un client i indicant data, nombre de persones i
          estat actual.
        </p>
        <InsertReservationForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Comandes i detall</h2>
        <p className="max-w-3xl text-stone-300">
          Insereix comandes completes indicant total, estat, mètode de pagament i les línies associades a
          <em>detall_pedido</em>. Cada línia referencia un producte existent i el seu subtotal.
        </p>
        <InsertOrderForm />
      </section>
    </div>
  )
}
