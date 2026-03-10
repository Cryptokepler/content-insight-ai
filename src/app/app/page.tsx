'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import ScoreGauge from '@/components/ScoreGauge'
import { CONTENT_TYPES, EXAMPLE_TEXTS, getAnalysisForText, type AnalysisResult } from '@/lib/mock-data'
import { FileText, Copy, Check, ChevronDown, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ListOrdered, Zap, Loader2 } from 'lucide-react'

const LOADING_STEPS = [
  'Analizando claridad del mensaje...',
  'Evaluando propuesta de valor...',
  'Identificando fortalezas...',
  'Detectando áreas de mejora...',
  'Generando recomendaciones...',
  'Creando versión optimizada...',
]

function CopyBtn({ text, id, copied, onCopy }: { text: string; id: string; copied: string | null; onCopy: (t: string, k: string) => void }) {
  return (
    <button onClick={() => onCopy(text, id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4F46E5] transition-colors">
      {copied === id ? <><Check size={12} className="text-green-500" /> Copiado</> : <><Copy size={12} /> Copiar</>}
    </button>
  )
}

export default function AppPage() {
  const [text, setText] = useState('')
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const contentTypeMap: Record<string, string> = {
    'Landing page': 'landing',
    'Anuncio': 'anuncio',
    'Email comercial': 'email',
    'Propuesta de valor': 'propuesta',
    'Descripción de servicio': 'servicio',
    'Bio / presentación': 'bio',
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i)
      await new Promise(r => setTimeout(r, 400))
    }
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, contentType: contentTypeMap[contentType] || 'landing' }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch {
      // Fallback to mock if API fails
      setResult(getAnalysisForText(text))
    }
    setLoading(false)
  }

  const handleCopy = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const useExample = (idx: number) => {
    setText(EXAMPLE_TEXTS[idx].text)
    setContentType(EXAMPLE_TEXTS[idx].type as typeof contentType)
    setResult(null)
  }

  const scoreColor = (s: number) => s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-500'

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Análisis de contenido</h1>
          <p className="text-gray-500 text-sm">Pega tu texto y obtén un análisis detallado con recomendaciones de mejora.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de contenido</label>
              <div className="relative">
                <select
                  value={contentType}
                  onChange={e => setContentType(e.target.value as typeof contentType)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                >
                  {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu contenido</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Pega aquí tu texto para analizar..."
                rows={10}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">{text.length} caracteres</span>
                {text.length > 0 && (
                  <button onClick={() => { setText(''); setResult(null) }} className="text-xs text-gray-400 hover:text-gray-600">Limpiar</button>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full bg-[#4F46E5] text-white font-medium py-3 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4F46E5]/20"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Analizando...</>
              ) : (
                <><Sparkles size={18} /> Analizar contenido</>
              )}
            </button>

            {loading && (
              <div className="bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl p-4 space-y-2">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${i <= loadingStep ? 'opacity-100' : 'opacity-30'}`}>
                    {i < loadingStep ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : i === loadingStep ? (
                      <Loader2 size={14} className="text-[#4F46E5] animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                    )}
                    <span className={i <= loadingStep ? 'text-gray-700' : 'text-gray-400'}>{step}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Ejemplos rápidos</p>
              <div className="space-y-2">
                {EXAMPLE_TEXTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => useExample(i)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#4F46E5]/30 hover:bg-[#4F46E5]/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#4F46E5]">{ex.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{ex.type} · {ex.text.length} caracteres</p>
                      </div>
                      <span className="text-xs text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity">Usar →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3">
            {!result && !loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin análisis aún</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">Pega tu contenido y haz clic en &quot;Analizar&quot; para obtener insights detallados.</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                {/* Score */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-in-up">
                  <div className="flex items-center gap-6">
                    <ScoreGauge score={result.score} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Score General</h3>
                      <p className={`text-sm font-medium ${scoreColor(result.score)}`}>
                        {result.score >= 80 ? 'Excelente' : result.score >= 60 ? 'Bueno — puede mejorar' : 'Necesita mejoras significativas'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Basado en claridad, propuesta de valor, estructura y persuasión.</p>
                    </div>
                  </div>
                </div>

                {/* Claridad + Propuesta */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-fade-in-up animate-delay-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} className="text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">Claridad del mensaje</h4>
                    </div>
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${
                      result.claridad.nivel.includes('Alto') ? 'bg-green-50 text-green-700' : result.claridad.nivel.includes('Medio') ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>{result.claridad.nivel}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.claridad.detalle}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-fade-in-up animate-delay-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-purple-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">Propuesta de valor</h4>
                    </div>
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${
                      result.propuestaValor.nivel.includes('Fuerte') || result.propuestaValor.nivel.includes('Alto') ? 'bg-green-50 text-green-700' : result.propuestaValor.nivel.includes('Medio') ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>{result.propuestaValor.nivel}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.propuestaValor.detalle}</p>
                  </div>
                </div>

                {/* Fortalezas */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-fade-in-up animate-delay-300">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Fortalezas
                  </h4>
                  <ul className="space-y-2">
                    {result.fortalezas.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mejoras */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-fade-in-up animate-delay-400">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    Áreas de mejora
                  </h4>
                  <ul className="space-y-2">
                    {result.mejoras.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recomendaciones */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-fade-in-up animate-delay-500">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ListOrdered size={16} className="text-[#4F46E5]" />
                    Recomendaciones accionables
                  </h4>
                  <ol className="space-y-2">
                    {result.recomendaciones.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Version Optimizada */}
                <div className="bg-gradient-to-br from-[#4F46E5]/5 to-cyan-50/50 border border-[#4F46E5]/20 rounded-2xl p-5 animate-fade-in-up animate-delay-600">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-[#4F46E5]" />
                      Versión optimizada
                    </h4>
                    <CopyBtn text={result.versionOptimizada} id="optimized" copied={copied} onCopy={handleCopy} />
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{result.versionOptimizada}</p>
                  </div>
                </div>

                {/* Copy all */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCopy(JSON.stringify(result, null, 2), 'all')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#4F46E5] transition-colors bg-white border border-gray-200 rounded-xl px-4 py-2"
                  >
                    {copied === 'all' ? <><Check size={14} className="text-green-500" /> Resultados copiados</> : <><Copy size={14} /> Copiar todos los resultados</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}