import Link from "next/link"

import { InsertCategoryForm } from "@/components/InsertCategoryForm"
import { InsertClientForm } from "@/components/InsertClientForm"
import { InsertOrderForm } from "@/components/InsertOrderForm"
import { InsertProductForm } from "@/components/InsertProductForm"
import { InsertReservationForm } from "@/components/InsertReservationForm"

export const metadata = {
  title: "Insertar datos · Ñam Ñam",
}

export default function InsertPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-stone-100">Insertar registros</h1>
        <p className="max-w-3xl text-stone-300">
          Usa els següents formularis per insertar registres en la base de dades.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Categorías</h2>
        <p className="max-w-3xl text-stone-300">
          Defineix la categoria a la que es assignaran els productes del menu. Ajuda a mantenir la carta
          organitzada i evitar duplicacions.
        </p>
        <InsertCategoryForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Clientes</h2>
        <p className="max-w-3xl text-stone-300">
          El alta de clients registra les seves dades de contacte per poder associar reserves i comandes.
        </p>
        <InsertClientForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Productos</h2>
        <p className="max-w-3xl text-stone-300">
          Afegeix articles del menu indicant el seu preu, disponibilitat i categoria. Assegura&apos;t que
          l&apos;identificador de categoria existeix prèviament en la taula <em>categoria</em> o consulta&apos;ls
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
        <h2 className="text-2xl font-semibold text-red-500">Reservas</h2>
        <p className="max-w-3xl text-stone-300">
          Registra noves reserves associant-les a un client i indicant data, nombre de persones i
          estat actual.
        </p>
        <InsertReservationForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Pedidos y detalle</h2>
        <p className="max-w-3xl text-stone-300">
          Inserta comandes complets indicant total, estat, mètode de pagament i les línies associades en
          <em>detall_pedido</em>. Cada línia referencia un producte existent i el seu subtotal.
        </p>
        <InsertOrderForm />
      </section>
    </div>
  )
}
