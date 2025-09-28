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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>Cas Pràctic 1 · Sergi Lucas · Derek Sanz · Soufiane Zemmah ·</span>
                <Link
                  href="https://github.com/torturado/demostraciogbd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-stone-800 px-3 py-1 text-red-300 transition-colors hover:border-red-400 hover:text-red-200"
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
                  <span className="font-medium">GitHub</span>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
