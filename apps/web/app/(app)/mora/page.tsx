'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  Clock, 
  TrendingDown, 
  Filter,
  ChevronRight,
  MoreVertical,
  PlusCircle,
  ShieldAlert,
  History
} from 'lucide-react';
import api from '@/lib/api';
import SeguimientoModal from '@/components/SeguimientoModal';

interface Mora {
  id: string;
  diasAtraso: number;
  montoPendiente: number;
  nivelRiesgo: 'LEVE' | 'GRAVE' | 'CRITICO';
  poliza: {
    id: string;
    numeroPoliza: string;
    tipo: string;
    cliente: {
      id: string;
      nombre: string;
      telefono: string;
    };
  };
  updatedAt: string;
}

const riskBadge: Record<string, { label: string; className: string }> = {
  LEVE:    { label: 'Leve',    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  MEDIA:   { label: 'Media',   className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  CRITICA: { label: 'Crítica', className: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]' },
};

export default function MoraPage() {
  const [moraItems, setMoraItems] = useState<Mora[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoliza, setSelectedPoliza] = useState<any>(null);

  const fetchMora = async () => {
    setLoading(true);
    try {
      const res = await api.get('/polizas/en-mora');
      // The backend returns Poliza[] with 'mora' included. 
      // We map it to the interface used in the page for cleaner consumption.
      const mapped = res.data.map((p: any) => ({
        ...p.mora,
        poliza: {
          id: p.id,
          numeroPoliza: p.numeroPoliza,
          tipo: p.tipo,
          cliente: p.cliente,
        }
      }));
      setMoraItems(mapped);
    } catch (err) {
      console.error('Error cargando mora:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMora();
  }, []);

  const totalDeuda = useMemo(() => 
    moraItems.reduce((acc, curr) => acc + curr.montoPendiente, 0), 
  [moraItems]);

  const filteredMora = useMemo(() => {
    if (!searchTerm.trim()) return moraItems;
    const term = searchTerm.toLowerCase();
    return moraItems.filter(item => 
      item.poliza.cliente.nombre.toLowerCase().includes(term) ||
      item.poliza.numeroPoliza.toLowerCase().includes(term)
    );
  }, [moraItems, searchTerm]);

  const handleAddSeguimiento = (poliza: any) => {
    setSelectedPoliza(poliza);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header & Hero Stats */}
      <div className="flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full w-fit border border-red-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Control de Riesgos
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Mora</h1>
          <p className="text-slate-400 text-sm">Monitorea y realiza seguimientos a las pólizas con pagos pendientes.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
          <div className="bg-[#1a1d27] border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deuda Total</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold text-white">${totalDeuda.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
          <div className="bg-[#1a1d27] border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pólizas en Mora</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold text-white">{moraItems.length}</span>
              <span className="text-xs text-slate-500 mb-1 ml-1 font-medium">Contratos</span>
            </div>
          </div>
          <div className="hidden sm:flex bg-[#1a1d27] border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Riesgo Crítico</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold text-red-400">{moraItems.filter(i => i.nivelRiesgo === 'CRITICO').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar por cliente o póliza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1d27] border border-slate-700/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 self-stretch">
          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold px-5 py-3.5 rounded-2xl transition-all border border-slate-700/50 flex-1 md:flex-none">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold px-5 py-3.5 rounded-2xl transition-all border border-slate-700/50 flex-1 md:flex-none">
            <History className="w-4 h-4" />
            Historial
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#1a1d27] border border-slate-800/50 rounded-3xl animate-pulse" />
          ))
        ) : filteredMora.length === 0 ? (
          <div className="bg-[#1a1d27] border border-slate-800/50 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-500/5 border border-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <TrendingDown className="w-10 h-10 text-emerald-500/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Felicitaciones! No hay mora</h3>
            <p className="text-slate-500 max-w-md mx-auto">Actualmente todos tus clientes están al día con sus pagos o no hay pólizas registradas en este estado.</p>
          </div>
        ) : (
          filteredMora.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-[#1a1d27] hover:bg-slate-800/40 border border-slate-800/60 p-6 rounded-[2rem] transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center gap-6"
            >
              {/* Client Info */}
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
                    <span className="text-white font-bold">{item.poliza.cliente.nombre.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{item.poliza.cliente.nombre}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                      <span className="text-blue-500">Póliza:</span> {item.poliza.numeroPoliza}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-500/60" />
                    {item.poliza.cliente.telefono}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-500/60" />
                    Desde: {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Status & Amount */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:px-8 md:border-x md:border-slate-800/50">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${riskBadge[item.nivelRiesgo].className}`}>
                  {riskBadge[item.nivelRiesgo].label}
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="flex items-center gap-1 text-white font-bold text-xl">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {item.montoPendiente.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monto Pendiente</span>
                </div>
              </div>

              {/* Days & Delay info */}
              <div className="flex flex-col justify-center items-start md:items-center min-w-[120px]">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${item.diasAtraso > 30 ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="text-2xl font-bold text-white">{item.diasAtraso}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Días de Atraso</span>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end md:pl-4">
                <button 
                  onClick={() => handleAddSeguimiento(item.poliza)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Seguimiento
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <SeguimientoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchMora();
        }}
        poliza={selectedPoliza}
      />
    </div>
  );
}
