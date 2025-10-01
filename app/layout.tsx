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

const navLinks = [
  { href: "/insert", label: "Inserir dades" },
  { href: "/queries", label: "Consultes" },
  { href: "/info", label: "Informació" },
  { href: "/datos", label: "Visualitzar dades" },
] as const

export const metadata: Metadata = {
  title: "Restaurant Ñam Ñam · Demo GBD",
  description:
    "Aplicació Next.js per demostrar insercions i consultes sobre la base de dades del restaurant Ñam Ñam.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ca">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
              <Link href="/" className="group flex items-center gap-2 text-sm font-semibold tracking-tight">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-primary/10 text-primary shadow-sm">
                  Ñ
                </span>
                <span className="text-base text-foreground transition-colors group-hover:text-primary">
                  Ñam Ñam · Demo GBD
                </span>
              </Link>
              <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-8 md:py-16 lg:py-20">{children}</div>
          </main>

          <footer className="border-t border-border/60 bg-background/60">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p className="font-medium text-foreground">
                Cas Pràctic 1 · Sergi Lucas · Derek Sanz · Soufiane Zemmah
              </p>
              <Link
                href="https://github.com/torturado/demostraciogbd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
              >
                <svg
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span className="font-medium">Repositori</span>
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
