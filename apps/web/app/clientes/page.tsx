'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Eye, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

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

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cartera de Clientes</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Gestiona tus clientes y sus pólizas
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1a1d27] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total:</span>
          <span className="text-white font-semibold">{clientes.length}</span>
          <span className="text-slate-500">clientes</span>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filtrados:</span>
            <span className="text-blue-400 font-semibold">{filteredClientes.length}</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1a1d27] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Cliente</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Cédula</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Contacto</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3">Pólizas</th>
                  <th className="text-right text-slate-400 font-medium px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente, i) => (
                  <tr
                    key={cliente.id}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                      i === filteredClientes.length - 1 ? 'border-none' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 font-semibold text-xs">
                            {cliente.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{cliente.nombre}</p>
                          {cliente.direccion && (
                            <p className="text-slate-500 text-xs">{cliente.direccion}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-mono text-xs bg-slate-800 px-2 py-1 rounded">
                        {cliente.cedula || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {cliente.telefono && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Phone className="w-3 h-3" />
                            {cliente.telefono}
                          </div>
                        )}
                        {cliente.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Mail className="w-3 h-3" />
                            {cliente.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300">
                          {cliente._count?.polizas || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/clientes/${cliente.id}`)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
