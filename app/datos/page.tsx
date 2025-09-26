import QueryResultTable from "@/components/QueryResultTable"
import prisma from "@/lib/prisma"
import { serializeQueryRows } from "@/lib/serialization"

export const metadata = {
  title: "Visualización de datos · Ñam Ñam",
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
        Nombre: categoria.nom,
      })),
    ),
    productos: serializeQueryRows(
      productos.map((producto) => ({
        ID: producto.idproducte,
        Nombre: producto.nom,
        Precio: producto.preu,
        Categoría: producto.categoria?.nom ?? "—",
        Disponible: producto.disponible,
      })),
    ),
    clientes: serializeQueryRows(
      clientes.map((cliente) => ({
        ID: cliente.idclient,
        Nombre: cliente.nom,
        Email: cliente.email,
        Teléfono: cliente.telefon,
      })),
    ),
    reservas: serializeQueryRows(
      reservas.map((reserva) => ({
        ID: reserva.idreserva,
        Cliente: reserva.client?.nom ?? reserva.idclient,
        Fecha: reserva.data,
        Personas: reserva.num_persones,
        Estado: reserva.estado,
      })),
    ),
    pedidos: serializeQueryRows(
      pedidos.map((pedido) => ({
        ID: pedido.idpedido,
        Cliente: pedido.client?.nom ?? pedido.idclient,
        Fecha: pedido.data,
        Total: pedido.total,
        Estado: pedido.estado,
        "Método pago": pedido.metode_pago,
        Líneas: pedido.detalls.length,
      })),
    ),
    detalles: serializeQueryRows(
      detalles.map((detalle) => ({
        ID: detalle.iddetall,
        Pedido: detalle.pedido?.idpedido ?? detalle.idpedido,
        Producto: detalle.producte?.nom ?? detalle.idproducte,
        Cantidad: detalle.quantitat,
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
      "Estructura bàsica de la carta: afegeix, modifica o revisa les categories a les que se associaran els productes.",
  },
  {
    key: "productos",
    title: "Productes",
    description:
      "Listado del menú con su precio, disponibilitat i categoria. Usa aquesta taula com a referencia al crear noves comandes.",
  },
  {
    key: "clientes",
    title: "Clients",
    description:
      "Personas registradas en la plataforma con sus datos de contacto para gestionar reserves i comandes.",
  },
  {
    key: "reservas",
    title: "Reserves",
    description:
      "Historial de reservas con data, nombre de comensals i estado actual per seguiment ràpid.",
  },
  {
    key: "pedidos",
    title: "Comandes",
    description:
      "Comandes realizades con su importe total, mètode de pago i nombre de línies associades.",
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
        <p className="text-sm uppercase tracking-wide text-red-500">Panel de dades</p>
        <h1 className="text-3xl font-semibold text-stone-100">Visualització de taules</h1>
        <p className="max-w-3xl text-stone-300">
          Consulta tota la informació emmagatzemada a la base de dades: categories,
          productes, clients, reserves i comandes. Usa aquesta vista com a referencia abans d&apos;insertar
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
