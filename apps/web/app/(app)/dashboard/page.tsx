'use client';

import { useEffect, useState } from 'react';
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  RefreshCw,
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  porVencer7: number;
  porVencer15: number;
  porVencer30: number;
  enMora: number;
  salvadas: number;
  canceladas: number;
}

interface PolizaReciente {
  id: string;
  numeroPoliza: string;
  estado: string;
  diasParaVencer?: number;
  diasAtraso?: number;
  cliente?: { nombre: string };
}

// Datos de muestra si la API aún no tiene el endpoint de dashboard
const defaultStats: Stats = {
  porVencer7: 0,
  porVencer15: 0,
  porVencer30: 0,
  enMora: 0,
  salvadas: 0,
  canceladas: 0,
};

const estadoBadge: Record<string, { label: string; className: string }> = {
  ACTIVA:    { label: 'Activa',    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  EN_RIESGO: { label: 'En riesgo', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  VENCIDA:   { label: 'Vencida',   className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  CANCELADA: { label: 'Cancelada', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [polizasRiesgo, setPolizasRiesgo] = useState<PolizaReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vencer, mora] = await Promise.allSettled([
        api.get('/polizas/por-vencer?dias=30'),
        api.get('/polizas/en-mora'),
      ]);

      const porVencer: PolizaReciente[] = vencer.status === 'fulfilled' ? vencer.value.data : [];
      const enMoraList: PolizaReciente[] = mora.status === 'fulfilled' ? mora.value.data : [];

      setStats({
        porVencer7:  porVencer.filter((p) => (p.diasParaVencer ?? 30) <= 7).length,
        porVencer15: porVencer.filter((p) => (p.diasParaVencer ?? 30) <= 15).length,
        porVencer30: porVencer.length,
        enMora:      enMoraList.length,
        salvadas:    porVencer.filter((p) => p.estado === 'ACTIVA').length,
        canceladas:  porVencer.filter((p) => p.estado === 'CANCELADA').length,
      });

      // Top riesgo: combina por vencer y en mora y toma los primeros 8
      const combined = [...porVencer, ...enMoraList].slice(0, 8);
      setPolizasRiesgo(combined);
    } catch {
      // keep defaults silently
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString('es-PA'));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpis = [
    {
      label: 'Vencen en 7 días',
      value: stats.porVencer7,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      tag: 'URGENTE',
      tagColor: 'bg-red-500/20 text-red-400',
    },
    {
      label: 'Vencen en 15 días',
      value: stats.porVencer15,
      icon: CalendarClock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      tag: 'ATENCIÓN',
      tagColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      label: 'Vencen en 30 días',
      value: stats.porVencer30,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      tag: 'SEGUIMIENTO',
      tagColor: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'En mora',
      value: stats.enMora,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      tag: 'COBRANZA',
      tagColor: 'bg-orange-500/20 text-orange-400',
    },
    {
      label: 'Pólizas salvadas',
      value: stats.salvadas,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      tag: 'RENOVADAS',
      tagColor: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      label: 'Canceladas',
      value: stats.canceladas,
      icon: XCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10 border-slate-500/20',
      tag: 'PERDIDAS',
      tagColor: 'bg-slate-500/20 text-slate-400',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Vista general del estado de la cartera
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Actualizado {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg, tag, tagColor }) => (
          <div
            key={label}
            className={`bg-[#1a1d27] border ${bg} rounded-xl p-5 flex flex-col gap-4`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-lg bg-[#0f1117] flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>
                {tag}
              </span>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white">{value}</p>
              )}
              <p className="text-slate-400 text-sm mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de pólizas en riesgo */}
      <div className="bg-[#1a1d27] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-white font-semibold">Pólizas en seguimiento prioritario</h2>
          <a href="/polizas" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Ver todas →
          </a>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : polizasRiesgo.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay pólizas en riesgo en este momento</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium px-6 py-3">N° Póliza</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Cliente</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {polizasRiesgo.map((p, i) => {
                  const badge = estadoBadge[p.estado] ?? estadoBadge['ACTIVA'];
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                        i === polizasRiesgo.length - 1 ? 'border-none' : ''
                      }`}
                    >
                      <td className="px-6 py-3.5 text-white font-mono">{p.numeroPoliza}</td>
                      <td className="px-6 py-3.5 text-slate-300">{p.cliente?.nombre ?? '—'}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
