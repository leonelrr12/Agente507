'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Eye, Phone, Mail, FileText, ChevronRight, Edit2, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ClientModal from '@/components/ClientModal';

interface Cliente {
  id: string;
  nombre: string;
  cedula: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  _count?: { polizas: number };
}

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | undefined>(undefined);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error('Error cargando clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    const term = searchTerm.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        (c.cedula && c.cedula.toLowerCase().includes(term))
    );
  }, [clientes, searchTerm]);

  const handleCreate = () => {
    setSelectedClient(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Está seguro que desea eliminar a "${nombre}"?`)) {
      try {
        await api.delete(`/clientes/${id}`);
        fetchClientes();
      } catch (err) {
        console.error('Error eliminando cliente:', err);
        alert('No se pudo eliminar el cliente.');
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cartera de Clientes</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Gestiona tus clientes y sus pólizas
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1d27] border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {/* Stats Summary */}
        <div className="flex items-center gap-4 text-sm px-4 py-2 bg-slate-800/20 border border-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Total:</span>
            <span className="text-white font-bold">{clientes.length}</span>
          </div>
          {searchTerm && (
            <>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <span>Filtrados:</span>
                <span>{filteredClientes.length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#1a1d27] border border-slate-800/50 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/30">
              <Search className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-white font-medium">No se encontraron clientes</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm 
                ? 'Intenta con otros términos o limpia el filtro' 
                : 'Empieza registrando tu primer cliente en el botón superior.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-700/50">
                  <th className="text-left text-slate-400 font-semibold px-6 py-4">Cliente</th>
                  <th className="text-left text-slate-400 font-semibold px-6 py-4">Cédula</th>
                  <th className="text-left text-slate-400 font-semibold px-6 py-4">Contacto</th>
                  <th className="text-left text-slate-400 font-semibold px-6 py-4">Pólizas</th>
                  <th className="text-right text-slate-400 font-semibold px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredClientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-blue-500/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="text-blue-400 font-bold text-sm">
                            {cliente.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-[15px]">{cliente.nombre}</p>
                          {cliente.direccion && (
                            <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{cliente.direccion}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-300 font-mono text-xs bg-slate-800 border border-slate-700/50 px-2 py-1 rounded-lg">
                        {cliente.cedula || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        {cliente.telefono && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Phone className="w-3.5 h-3.5 text-blue-500/60" />
                            {cliente.telefono}
                          </div>
                        )}
                        {cliente.email && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Mail className="w-3.5 h-3.5 text-blue-500/60" />
                            {cliente.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          (cliente._count?.polizas || 0) > 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                          <FileText className="w-3 h-3" />
                          {cliente._count?.polizas || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/clientes/${cliente.id}`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id, cliente.nombre)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Modal */}
      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClientes}
        client={selectedClient}
      />
    </div>
  );
}
