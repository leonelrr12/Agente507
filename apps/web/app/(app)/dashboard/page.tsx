'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  RefreshCw,
  Users,
  ShieldCheck,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import api from '@/lib/api';

interface Stats {
  kpis: {
    totalClientes: number;
    porVencer7: number;
    porVencer15: number;
    porVencer30: number;
    enMora: number;
    volumenCartera: number;
  };
  graficos: {
    distribucionRamo: { tipo: string; cantidad: number }[];
    riesgoMora: { nivel: string; cantidad: number }[];
  };
  recientes: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const MORA_COLORS: Record<string, string> = {
  LEVE: '#10b981',
  MEDIA: '#f59e0b',
  CRITICA: '#ef4444',
};

export default function DashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/resumen');
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString('es-PA'));
    } catch (err) {
      console.error('Error dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpis = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Clientes Activos',
        value: data.kpis.totalClientes,
        icon: Users,
        color: 'text-blue-400',
        bg: 'bg-blue-600/10 border-blue-500/20',
      },
      {
        label: 'Cartera Estimada',
        value: `$${data.kpis.volumenCartera.toLocaleString()}`,
        icon: DollarSign,
        color: 'text-emerald-400',
        bg: 'bg-emerald-600/10 border-emerald-500/20',
      },
      {
        label: 'Críticos (7 días)',
        value: data.kpis.porVencer7,
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/20',
      },
      {
        label: 'Vencen (30 días)',
        value: data.kpis.porVencer30,
        icon: CalendarClock,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
      },
      {
        label: 'En Mora',
        value: data.kpis.enMora,
        icon: Clock,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/20',
      },
    ];
  }, [data]);

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            Panel de Control
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Revisión estratégica de tu cartera de seguros para <span className="text-white font-bold">Panamá</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Ultima Actualización</span>
            <span className="text-sm text-slate-300 font-mono">{lastUpdated || '--:--'}</span>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-2xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-[#1a1d27] border border-slate-800 rounded-3xl animate-pulse" />
          ))
        ) : kpis.map((kpi, i) => (
          <div
            key={i}
            className={`bg-[#1a1d27] border ${kpi.bg} p-6 rounded-3xl flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-sm group`}
          >
            <kpi.icon className={`w-6 h-6 ${kpi.color} mb-4 group-hover:scale-110 transition-transform`} />
            <div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Ramos */}
        <div className="bg-[#1a1d27] border border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-blue-500" />
              Distribución por Ramo
            </h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.graficos.distribucionRamo || []}>
                <XAxis 
                  dataKey="tipo" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: '#1a1d27', border: '1px solid #334155', borderRadius: '12px'}}
                  itemStyle={{color: '#fff', fontSize: '12px'}}
                />
                <Bar 
                  dataKey="cantidad" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                >
                  {data?.graficos.distribucionRamo.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Riesgo Mora */}
        <div className="bg-[#1a1d27] border border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-red-500" />
              Riesgo de Cobranza
            </h3>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.graficos.riesgoMora || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="cantidad"
                  nameKey="nivel"
                  animationDuration={1500}
                >
                  {data?.graficos.riesgoMora.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MORA_COLORS[entry.nivel] || '#334155'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#1a1d27', border: '1px solid #334155', borderRadius: '12px'}}
                  itemStyle={{fontSize: '12px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 gap-8">
         <div className="bg-[#1a1d27] border border-slate-800 rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/10">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Ultimas Pólizas Emitidas
              </h3>
              <a href="/polizas" className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 transition-colors">
                Ver Todas
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-800/30">
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Cliente</th>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">N° Contrato</th>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Ramo</th>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i}><td colSpan={4} className="px-8 py-4 animate-pulse"><div className="h-6 bg-slate-800/50 rounded-lg w-full" /></td></tr>
                      ))
                    ) : data?.recientes.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-500">No hay actividad reciente.</td></tr>
                    ) : data?.recientes.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {p.cliente.nombre.charAt(0)}
                            </div>
                            <span className="text-white font-semibold">{p.cliente.nombre}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 font-mono text-slate-400">{p.numeroPoliza}</td>
                        <td className="px-8 py-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                            {p.tipo}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <span className="text-emerald-400 font-bold">${p.monto?.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
