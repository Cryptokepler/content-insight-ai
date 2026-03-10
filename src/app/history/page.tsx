'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { MOCK_HISTORY, type HistoryEntry } from '@/lib/mock-data'
import { History, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import ScoreGauge from '@/components/ScoreGauge'

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? 'bg-green-50 text-green-700 border-green-200' : score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{score}/100</span>
}

export default function HistoryPage() {
  const [selected, setSelected] = useState<HistoryEntry | null>(null)

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Historial de análisis</h1>
          <p className="text-gray-500 text-sm">Revisa tus análisis anteriores y su evolución.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Título</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">Tipo</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Score</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                      <p className="text-xs text-gray-400 sm:hidden">{entry.contentType}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{entry.contentType}</span>
                    </td>
                    <td className="px-6 py-4 text-center"><ScoreBadge score={entry.score} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selected.title}</h3>
                <p className="text-sm text-gray-500">{selected.contentType} · {selected.date}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-center"><ScoreGauge score={selected.score} /></div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Claridad del mensaje</h4>
                <p className="text-sm text-gray-600">{selected.result.claridad.detalle}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Fortalezas</h4>
                <ul className="space-y-1">
                  {selected.result.fortalezas.map((f, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><CheckCircle2 size={12} className="text-green-500 mt-1 shrink-0" />{f}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Áreas de mejora</h4>
                <ul className="space-y-1">
                  {selected.result.mejoras.map((m, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><AlertTriangle size={12} className="text-amber-500 mt-1 shrink-0" />{m}</li>)}
                </ul>
              </div>
              <div className="bg-[#4F46E5]/5 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Versión optimizada</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selected.result.versionOptimizada}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
