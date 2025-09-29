import QueryResultTable from "@/components/QueryResultTable"
import prisma from "@/lib/prisma"
import { serializeQueryRows } from "@/lib/serialization"

export const metadata = {
  title: "Visualització de dades · Ñam Ñam",
}

async function getData() {
  const [categorias, productos, clientes, reservas, pedidos, detalles] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { idcategoria: "asc" } }),
    prisma.producte.findMany({
      orderBy: { idproducte: "asc" },
      include: { categoria: true },
    }),
    prisma.client.findMany({ orderBy: { idclient: "asc" } }),
    prisma.reserva.findMany({
      orderBy: { data: "desc" },
      include: { client: { select: { nom: true } } },
    }),
    prisma.pedido.findMany({
      orderBy: { idpedido: "desc" },
      include: { client: { select: { nom: true } }, detalls: true },
    }),
    prisma.detallPedido.findMany({
      orderBy: { iddetall: "desc" },
      include: {
        pedido: { select: { idpedido: true } },
        producte: { select: { nom: true } },
      },
    }),
  ])

  return {
    categorias: serializeQueryRows(
      categorias.map((categoria) => ({
        ID: categoria.idcategoria,
        Nom: categoria.nom,
      })),
    ),
    productos: serializeQueryRows(
      productos.map((producto) => ({
        ID: producto.idproducte,
        Nom: producto.nom,
        Preu: producto.preu,
        Categoria: producto.categoria?.nom ?? "—",
        Disponible: producto.disponible,
      })),
    ),
    clientes: serializeQueryRows(
      clientes.map((cliente) => ({
        ID: cliente.idclient,
        Nom: cliente.nom,
        Email: cliente.email,
        "Telèfon": cliente.telefon,
      })),
    ),
    reservas: serializeQueryRows(
      reservas.map((reserva) => ({
        ID: reserva.idreserva,
        Client: reserva.client?.nom ?? reserva.idclient,
        Data: reserva.data,
        Persones: reserva.num_persones,
        Estat: reserva.estado,
      })),
    ),
    pedidos: serializeQueryRows(
      pedidos.map((pedido) => ({
        ID: pedido.idpedido,
        Client: pedido.client?.nom ?? pedido.idclient,
        Data: pedido.data,
        Total: pedido.total,
        Estat: pedido.estado,
        "Mètode de pagament": pedido.metode_pago,
        "Línies": pedido.detalls.length,
      })),
    ),
    detalles: serializeQueryRows(
      detalles.map((detalle) => ({
        ID: detalle.iddetall,
        Comanda: detalle.pedido?.idpedido ?? detalle.idpedido,
        Producte: detalle.producte?.nom ?? detalle.idproducte,
        Quantitat: detalle.quantitat,
        Subtotal: detalle.subtotal,
      })),
    ),
  }
}

const sections = [
  {
    key: "categorias",
    title: "Categories",
    description:
      "Estructura bàsica de la carta: afegeix, modifica o revisa les categories a les quals s'associaran els productes.",
  },
  {
    key: "productos",
    title: "Productes",
    description:
      "Llistat del menú amb el seu preu, disponibilitat i categoria. Utilitza aquesta taula com a referència en crear noves comandes.",
  },
  {
    key: "clientes",
    title: "Clients",
    description:
      "Persones registrades a la plataforma amb les seves dades de contacte per gestionar reserves i comandes.",
  },
  {
    key: "reservas",
    title: "Reserves",
    description:
      "Historial de reserves amb data, nombre de comensals i estat actual per a un seguiment ràpid.",
  },
  {
    key: "pedidos",
    title: "Comandes",
    description:
      "Comandes realitzades amb el seu import total, mètode de pagament i nombre de línies associades.",
  },
  {
    key: "detalles",
    title: "Detall de comandes",
    description:
      "Detall granular de cada comanda mostrant producte, quantitat i subtotal individual.",
  },
] as const

export default async function DataPage() {
  const data = await getData()

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-red-500">Panell de dades</p>
        <h1 className="text-3xl font-semibold text-stone-100">Visualització de taules</h1>
        <p className="max-w-3xl text-stone-300">
          Consulta tota la informació emmagatzemada a la base de dades: categories,
          productes, clients, reserves i comandes. Utilitza aquesta vista com a referència abans d'inserir
          nous registres.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.key} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-red-500">{section.title}</h2>
              <p className="max-w-3xl text-stone-300">{section.description}</p>
            </div>
            <QueryResultTable rows={data[section.key]} title={section.title} />
          </section>
        ))}
      </div>
    </div>
  )
}
