
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#4F46E5] rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Content Insight AI</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input type="email" defaultValue="jhonatan@kepleragents.com" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Contraseña</label>
            <input type="password" defaultValue="password123" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              Recordarme
            </label>
            <a href="#" className="text-xs text-[#4F46E5] hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#4F46E5] text-white font-medium py-2.5 rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">¿No tienes cuenta? <Link href="/app" className="text-[#4F46E5] hover:underline">Regístrate gratis</Link></p>
      </div>
    </div>
  )
}
