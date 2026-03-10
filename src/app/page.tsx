import Link from 'next/link'
import { BarChart3, Lightbulb, Target, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">Content Insight AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
            <Link href="/app" className="text-sm bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors">Comenzar gratis</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-cyan-50/50" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Lightbulb size={14} />
            Potenciado por IA estructurada
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
            Analiza y mejora tu contenido con{' '}
            <span className="text-[#4F46E5]">IA estructurada</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Convierte textos comunes en mensajes más claros, persuasivos y profesionales. Obtén análisis detallado, score de calidad y versiones optimizadas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-[#4338CA] transition-colors shadow-lg shadow-[#4F46E5]/25">
              Analizar mi contenido
              <ArrowRight size={18} />
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium px-6 py-3.5">
              Ver cómo funciona ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-gray-400">contentinsight.ai/app</span>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-32 flex items-start">
                <p className="text-sm text-gray-400">Somos una empresa líder en soluciones digitales...</p>
              </div>
              <div className="mt-4 bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-lg inline-block">Analizar</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="w-14 h-14 rounded-full border-4 border-[#4F46E5] flex items-center justify-center">
                  <span className="text-lg font-bold text-[#4F46E5]">78</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Score General</p>
                  <p className="text-xs text-gray-500">Análisis completado</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-700">3 Fortalezas</p>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-700">4 Mejoras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50/50 border-t border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">¿Cómo funciona?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">Pega tu texto, selecciona el tipo de contenido y obtén un análisis profesional en segundos.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Análisis estructurado', desc: 'Evaluamos claridad, propuesta de valor, fortalezas y áreas de mejora en bloques organizados.' },
              { icon: TrendingUp, title: 'Score de calidad', desc: 'Obtén un puntaje de 0 a 100 que refleja la efectividad de tu contenido de forma objetiva.' },
              { icon: CheckCircle2, title: 'Mejoras accionables', desc: 'Recibe recomendaciones específicas y una versión optimizada lista para usar.' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#4F46E5]/20 transition-all duration-300">
                <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-xl flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-[#4F46E5]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mejora tu contenido hoy</h2>
          <p className="text-gray-600 mb-8">No necesitas ser copywriter. Nuestra IA analiza tu texto y te da exactamente lo que necesitas para mejorarlo.</p>
          <Link href="/app" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-[#4338CA] transition-colors shadow-lg shadow-[#4F46E5]/25">
            Comenzar análisis gratuito
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 bg-[#4F46E5] rounded flex items-center justify-center">
              <BarChart3 size={12} className="text-white" />
            </div>
            Content Insight AI
          </div>
          <p className="text-xs text-gray-400">© 2026 Content Insight AI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
