import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Restaurant Ñam Ñam · Demo GBD",
  description:
    "Aplicació Next.js para demostrar insercions i consultas sobre la base de dades del restaurant Ñam Ñam.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
        <div className="flex flex-1 flex-col bg-gradient-to-b from-[#211d1b] via-[#1c1917] to-[#161310]">
          <header className="border-b border-stone-800/70 bg-stone-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold text-red-500">
                Ñam Ñam · BD Demo
              </Link>
              <nav className="flex gap-4 text-sm font-medium text-stone-200">
                <Link className="hover:text-red-400" href="/insert">
                  Insertar dades
                </Link>
                <Link className="hover:text-red-400" href="/queries">
                  Consultes
                </Link>
                <Link className="hover:text-red-400" href="/info">
                  Informació
                </Link>
                <Link className="hover:text-red-400" href="/datos">
                  Visualitzar dades
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
          <footer className="border-t border-stone-800/70 bg-stone-950/70">
            <div className="mx-auto w-full max-w-5xl px-4 py-4 text-sm text-stone-400">
              Cas Pràctic 1 · Sergi Lucas · Derek Sanz · Soufiane Zemmah
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
