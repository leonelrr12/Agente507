'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, User, Phone, Mail, IdCard, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const clientSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  cedula: z.string().optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: any; // If provided, we are editing
}

export default function ClientModal({ isOpen, onClose, onSuccess, client }: ClientModalProps) {
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: '',
      cedula: '',
      telefono: '',
      email: '',
      direccion: '',
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        nombre: client.nombre || '',
        cedula: client.cedula || '',
        telefono: client.telefono || '',
        email: client.email || '',
        direccion: client.direccion || '',
      });
    } else {
      reset({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        direccion: '',
      });
    }
  }, [client, reset, isOpen]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (isEditing) {
        await api.patch(`/clientes/${client.id}`, data);
      } else {
        await api.post('/clientes', data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente. Por favor intente de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-[#1a1d27] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Nombre Completo
            </label>
            <input
              {...register('nombre')}
              placeholder="Ej: Juan Pérez"
              className={`w-full bg-[#0f1117] border ${errors.nombre ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20'} rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.nombre && <p className="text-xs text-red-400 mt-1">{errors.nombre.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cédula */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <IdCard className="w-3.5 h-3.5" />
                Cédula / ID
              </label>
              <input
                {...register('cedula')}
                placeholder="0-000-0000"
                className="w-full bg-[#0f1117] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                Teléfono
              </div>
              <input
                {...register('telefono')}
                placeholder="+507 6000-0000"
                className="w-full bg-[#0f1117] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              Correo Electrónico
            </label>
            <input
              {...register('email')}
              placeholder="ejemplo@correo.com"
              className={`w-full bg-[#0f1117] border ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20'} rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Dirección */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Dirección
            </label>
            <textarea
              {...register('direccion')}
              placeholder="Dirección completa..."
              rows={3}
              className="w-full bg-[#0f1117] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-2.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                isEditing ? 'Actualizar' : 'Crear Cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
