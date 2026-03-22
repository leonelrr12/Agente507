'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  IdCard, 
  MapPin, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import ClientModal from '@/components/ClientModal';
import PolizaModal from '@/components/PolizaModal';

interface Poliza {
  id: string;
  numeroPoliza: string;
  tipo: 'AUTO' | 'SALUD' | 'VIDA';
  estado: 'ACTIVA' | 'EN_RIESGO' | 'VENCIDA' | 'CANCELADA';
  fechaVencimiento: string;
}

interface Cliente {
  id: string;
  nombre: string;
  cedula: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  polizas: Poliza[];
}

const estadoBadge: Record<string, { label: string; className: string }> = {
  ACTIVA:    { label: 'Activa',    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  EN_RIESGO: { label: 'En riesgo', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  VENCIDA:   { label: 'Vencida',   className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  CANCELADA: { label: 'Cancelada', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

export default function ClienteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isPolizaModalOpen, setIsPolizaModalOpen] = useState(false);
  const [selectedPoliza, setSelectedPoliza] = useState<any>(null);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/clientes/${id}`);
      setCliente(res.data);
    } catch (err) {
      console.error('Error cargando cliente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const handleEditPoliza = (poliza: any) => {
    setSelectedPoliza(poliza);
    setIsPolizaModalOpen(true);
  };

  const handleCreatePoliza = () => {
    setSelectedPoliza(null);
    setIsPolizaModalOpen(true);
  };

  const handleDeletePoliza = async (polid: string, num: string) => {
    if (confirm(`¿Eliminar póliza N° ${num}?`)) {
      try {
        await api.delete(`/polizas/${polid}`);
        fetchCliente();
      } catch (err) {
        alert('Error al eliminar póliza');
      }
    }
  };

  const handleDeleteCliente = async () => {
    if (confirm(`¿Está seguro que desea eliminar a "${cliente?.nombre}"?`)) {
      try {
        await api.delete(`/clientes/${id}`);
        router.push('/clientes');
      } catch (err) {
        console.error('Error eliminando cliente:', err);
        alert('No se pudo eliminar el cliente.');
      }
    }
  };

  if (loading) {
// ... existing loading UI ...
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-slate-800 rounded-lg" />
        <div className="h-48 w-full bg-slate-800 rounded-2xl" />
        <div className="h-64 w-full bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white">Cliente no encontrado</h2>
        <button 
          onClick={() => router.push('/clientes')}
          className="mt-4 text-blue-400 hover:underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header / Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Volver</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all border border-slate-700"
          >
            <Edit2 className="w-4 h-4" />
            Editar Info
          </button>
          <button 
            onClick={handleDeleteCliente}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-xl transition-all border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Main Info Card ... omitting for brevity ... */}
      
      {/* Pólizas Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Cartera de Pólizas
          </h2>
          <button 
            onClick={handleCreatePoliza}
            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-500/20 transition-all"
          >
            + Nueva Póliza
          </button>
        </div>

        <div className="bg-[#1a1d27] border border-slate-800/50 rounded-2xl overflow-hidden shadow-sm">
          {cliente.polizas.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-30" />
              <p className="text-slate-500 text-sm">Este cliente no tiene pólizas registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-800/40 border-b border-slate-700/50">
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs">N° Póliza</th>
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs">Tipo</th>
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs">Vencimiento</th>
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs">Estado</th>
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {cliente.polizas.map((p) => {
                    const badge = estadoBadge[p.estado] || estadoBadge['ACTIVA'];
                    return (
                      <tr key={p.id} className="hover:bg-blue-600/5 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-white">{p.numeroPoliza}</td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300 font-medium">{p.tipo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-blue-500/60" />
                            {new Date(p.fechaVencimiento).toLocaleDateString('es-PA')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditPoliza(p)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar póliza"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePoliza(p.id, p.numeroPoliza)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar póliza"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      <ClientModal 
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSuccess={fetchCliente}
        client={cliente}
      />

      <PolizaModal 
        isOpen={isPolizaModalOpen}
        onClose={() => setIsPolizaModalOpen(false)}
        onSuccess={fetchCliente}
        clienteId={cliente.id}
        poliza={selectedPoliza}
      />
    </div>
  );
}
