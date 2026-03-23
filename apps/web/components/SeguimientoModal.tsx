'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Phone, MessageSquare, Mail, Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

const seguimientoSchema = z.object({
  tipo: z.enum(['LLAMADA', 'WHATSAPP', 'EMAIL']),
  resultado: z.string().optional(),
  comentario: z.string().min(5, 'El comentario debe ser más descriptivo'),
  proximaAccion: z.string().optional().or(z.literal('')),
});

type SeguimientoFormValues = z.infer<typeof seguimientoSchema>;

interface SeguimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  poliza: any;
}

export default function SeguimientoModal({ isOpen, onClose, onSuccess, poliza }: SeguimientoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SeguimientoFormValues>({
    resolver: zodResolver(seguimientoSchema),
    defaultValues: {
      tipo: 'LLAMADA',
      resultado: 'PENDIENTE',
      comentario: '',
      proximaAccion: '',
    },
  });

  const selectedTipo = watch('tipo');

  const onSubmit = async (data: SeguimientoFormValues) => {
    try {
      await api.post('/seguimientos', {
        ...data,
        polizaId: poliza.id,
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error saving seguimiento:', error);
      alert('Error al registrar el seguimiento. Verifique los datos.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-[#1a1d27] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-slate-800/20 border-b border-slate-800/50">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Registrar Seguimiento
              </h2>
              <p className="text-slate-500 text-xs mt-1">Bitácora para la póliza <span className="text-blue-400 font-bold">{poliza?.numeroPoliza}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Medio de Contacto</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LLAMADA', 'WHATSAPP', 'EMAIL'] as const).map((tipo) => (
                  <label 
                    key={tipo}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      selectedTipo === tipo 
                        ? 'bg-blue-600/20 border-blue-600/50 text-blue-400 shadow-lg' 
                        : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <input type="radio" {...register('tipo')} value={tipo} className="hidden" />
                    {tipo === 'LLAMADA' && <Phone className="w-4 h-4" />}
                    {tipo === 'WHATSAPP' && <MessageSquare className="w-4 h-4" />}
                    {tipo === 'EMAIL' && <Mail className="w-4 h-4" />}
                    {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Resultado Gestión</label>
              <select
                {...register('resultado')}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white text-xs font-bold focus:outline-none"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="PROMETE_PAGO">Promete Pago</option>
                <option value="NO_CONTESTO">No Contestó</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Comentario</label>
            <textarea
              {...register('comentario')}
              placeholder="Detalles de la gestión..."
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Próxima Acción (Opcional)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="date"
                {...register('proximaAccion')}
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button type="button" onClick={onClose} className="flex-1 text-slate-400 font-bold text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-white/5 transition-all text-center">
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[1.5] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Guardar Gestión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
