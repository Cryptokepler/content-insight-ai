'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, weekly: false, tips: true })

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuración</h1>
          <p className="text-gray-500 text-sm">Administra tu perfil y preferencias.</p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Perfil</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre</label>
                <input type="text" defaultValue="Jhonatan Kepler" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                <input type="email" defaultValue="jhonatan@kepleragents.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900" />
              </div>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">API Key</h2>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                defaultValue="sk-proj-abc123def456ghi789"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-mono"
              />
              <button onClick={() => setShowKey(!showKey)} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
                {showKey ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Tu clave API se usa para autenticar las solicitudes de análisis.</p>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Preferencias</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipo de contenido predeterminado</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900">
                  <option>Landing page</option>
                  <option>Anuncio</option>
                  <option>Email comercial</option>
                  <option>Descripción de servicio</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Idioma</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900">
                  <option>Español</option>
                  <option>English</option>
                  <option>Português</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Notificaciones</h2>
            <div className="space-y-4">
              {([
                ['email', 'Notificaciones por email', 'Recibe alertas cuando se completen análisis largos.'],
                ['weekly', 'Resumen semanal', 'Un resumen de tus análisis y métricas cada lunes.'],
                ['tips', 'Tips de copywriting', 'Consejos semanales para mejorar tu contenido.'],
              ] as const).map(([key, title, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${notifications[key as keyof typeof notifications] ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notifications[key as keyof typeof notifications] ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-[#4F46E5] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#4338CA] transition-colors">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
