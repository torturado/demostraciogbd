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
    <div className="space-y-14">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Inserir registres</h1>
        <p className="max-w-3xl text-muted-foreground">
          Utilitza aquests formularis per inserir informació a la base de dades i entendre com Prisma gestiona les claus,
          validacions i relacions entre taules.
        </p>
      </header>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Categories</h2>
          <p className="max-w-3xl text-muted-foreground">
            Defineix les agrupacions del menú perquè els productes quedin classificats i sigui més senzill construir les
            consultes.
          </p>
        </div>
        <InsertCategoryForm />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Clients</h2>
          <p className="max-w-3xl text-muted-foreground">
            Registra les dades de contacte per poder associar reserves i comandes. Recorda que el correu ha de ser únic.
          </p>
        </div>
        <InsertClientForm />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Productes</h2>
          <p className="max-w-3xl text-muted-foreground">
            Dona d'alta articles amb preu, disponibilitat i categoria. Pots consultar els identificadors des de
            <Link className="text-primary transition-colors hover:text-primary/80" href="/datos">
              {" "}
              Visualitzar dades
            </Link>
            .
          </p>
        </div>
        <InsertProductForm />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Reserves</h2>
          <p className="max-w-3xl text-muted-foreground">
            Registra reserves associant-les a un client i indicant data, nombre de persones i estat actual per fer seguiment.
          </p>
        </div>
        <InsertReservationForm />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Comandes i detall</h2>
          <p className="max-w-3xl text-muted-foreground">
            Insereix comandes completes amb total, estat, mètode de pagament i línies de detall vinculades a productes
            existents.
          </p>
        </div>
        <InsertOrderForm />
      </section>
    </div>
  )
}
