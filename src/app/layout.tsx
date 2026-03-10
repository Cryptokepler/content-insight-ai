import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Insight AI - Analiza y mejora tu contenido',
  description: 'Convierte textos comunes en mensajes más claros, persuasivos y profesionales con IA estructurada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
