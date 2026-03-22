'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, User, Phone, Mail, IdCard, MapPin, Loader2, Sparkles } from 'lucide-react';
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
  client?: any;
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
      nombre: '', cedula: '', telefono: '', email: '', direccion: '',
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
      reset({ nombre: '', cedula: '', telefono: '', email: '', direccion: '' });
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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative bg-[#1a1d27] border border-white/10 w-full max-w-xl rounded-[2rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 px-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                Gestión
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {isEditing ? 'Editar Cliente' : 'Nuevo Registro'}
              {!isEditing && <Sparkles className="w-5 h-5 text-blue-400" />}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6">
          <div className="space-y-5">
            {/* Nombre */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('nombre')}
                  placeholder="Ej: Eduardo Rodriguez"
                  className={`w-full bg-black/20 border ${errors.nombre ? 'border-red-500/50' : 'border-white/5 focus:border-blue-500/50'} rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner`}
                />
              </div>
              {errors.nombre && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1">{errors.nombre.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Cédula */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cédula</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register('cedula')}
                    placeholder="8-921-1234"
                    className="w-full bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register('telefono')}
                    placeholder="6000-0000"
                    className="w-full bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('email')}
                  placeholder="cliente@correo.com"
                  className="w-full bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <textarea
                  {...register('direccion')}
                  placeholder="Provincia, Distrito, Corregimiento..."
                  rows={2}
                  className="w-full bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
