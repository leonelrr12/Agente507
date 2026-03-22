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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = async () => {
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all border border-slate-700"
          >
            <Edit2 className="w-4 h-4" />
            Editar Info
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-xl transition-all border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-[#1a1d27] border border-slate-800/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-8 md:p-10 border-b border-slate-800/50">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-600/40 ring-4 ring-[#1a1d27]">
              {cliente.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{cliente.nombre}</h1>
              <div className="flex flex-wrap gap-4 items-center capitalize">
                <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <IdCard className="w-4 h-4 text-blue-400" />
                  {cliente.cedula || 'Sin cédula'}
                </span>
                <div className="w-1 h-1 bg-slate-700 rounded-full hidden md:block" />
                <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {cliente.polizas.length} Pólizas registradas
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Información de contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                  <p className="text-white font-semibold">{cliente.telefono || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="text-white font-semibold truncate">{cliente.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ubicación registrada</h3>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-800/50 min-h-[120px]">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium italic mb-2">Residencia / Oficina</p>
                <p className="text-white leading-relaxed font-medium">
                  {cliente.direccion || 'No se ha registrado una dirección física para este cliente.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pólizas Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Cartera de Pólizas
          </h2>
          <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
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
                    <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-tight text-xs"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {cliente.polizas.map((p) => {
                    const badge = estadoBadge[p.estado] || estadoBadge['ACTIVA'];
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-white">{p.numeroPoliza}</td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300 font-medium">{p.tipo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(p.fechaVencimiento).toLocaleDateString('es-PA')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="p-2 text-slate-500 hover:text-white transition-colors"
                            title="Ver póliza"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCliente}
        client={cliente}
      />
    </div>
  );
}
