'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, FileText, Calendar, DollarSign, Shield, Loader2, Landmark, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const polizaSchema = z.object({
  numeroPoliza: z.string().min(3, 'El número de póliza es requerido'),
  tipo: z.enum(['AUTO', 'SALUD', 'VIDA']),
  subtipo: z.string().optional().nullable(),
  fechaVencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
  fechaInicio: z.string().optional().nullable(),
  estado: z.enum(['ACTIVA', 'EN_RIESGO', 'VENCIDA', 'CANCELADA']),
  monto: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional().nullable()),
  frecuenciaPago: z.string().optional().nullable(),
  aseguradoraId: z.string().optional().nullable(),
  clienteId: z.string(),
});

type PolizaFormValues = z.infer<typeof polizaSchema>;

interface PolizaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clienteId: string;
  poliza?: any; // For editing
}

export default function PolizaModal({ isOpen, onClose, onSuccess, clienteId, poliza }: PolizaModalProps) {
  const isEditing = !!poliza;
  const [aseguradoras, setAseguradoras] = useState<{ id: string; nombre: string }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PolizaFormValues>({
    resolver: zodResolver(polizaSchema),
    defaultValues: {
      numeroPoliza: '',
      tipo: 'AUTO',
      subtipo: '',
      fechaVencimiento: '',
      fechaInicio: '',
      estado: 'ACTIVA',
      monto: 0,
      frecuenciaPago: 'MENSUAL',
      aseguradoraId: '',
      clienteId: clienteId,
    },
  });

  useEffect(() => {
    const fetchAseguradoras = async () => {
      try {
        const res = await api.get('/aseguradoras');
        setAseguradoras(res.data);
      } catch (error) {
        console.error('Error fetching aseguradoras:', error);
      }
    };
    if (isOpen) {
      fetchAseguradoras();
    }
  }, [isOpen]);

  useEffect(() => {
    if (poliza) {
      reset({
        numeroPoliza: poliza.numeroPoliza || '',
        tipo: poliza.tipo || 'AUTO',
        subtipo: poliza.subtipo || '',
        fechaVencimiento: poliza.fechaVencimiento ? new Date(poliza.fechaVencimiento).toISOString().split('T')[0] : '',
        fechaInicio: poliza.fechaInicio ? new Date(poliza.fechaInicio).toISOString().split('T')[0] : '',
        estado: poliza.estado || 'ACTIVA',
        monto: poliza.monto || 0,
        frecuenciaPago: poliza.frecuenciaPago || 'MENSUAL',
        aseguradoraId: poliza.aseguradoraId || '',
        clienteId: clienteId,
      });
    } else {
      reset({
        numeroPoliza: '',
        tipo: 'AUTO',
        subtipo: '',
        fechaVencimiento: '',
        fechaInicio: '',
        estado: 'ACTIVA',
        monto: 0,
        frecuenciaPago: 'MENSUAL',
        aseguradoraId: '',
        clienteId: clienteId,
      });
    }
  }, [poliza, reset, isOpen, clienteId]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        monto: data.monto ? Number(data.monto) : undefined,
        aseguradoraId: data.aseguradoraId || undefined,
      };
      if (isEditing) {
        await api.patch(`/polizas/${poliza.id}`, payload);
      } else {
        await api.post('/polizas', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving poliza:', error);
      alert('Error al guardar la póliza. Verifique los datos.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-[#1a1d27] border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-500" />
              {isEditing ? 'Editar Póliza' : 'Nueva Póliza de Seguros'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Registra los detalles técnicos del contrato</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="px-10 pb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* N° Póliza */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">N° de Póliza</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('numeroPoliza')}
                  placeholder="Ej: AUTO-123456"
                  className={`w-full bg-black/20 border ${errors.numeroPoliza ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'} rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all`}
                />
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tipo de Seguro</label>
              <select
                {...register('tipo')}
                className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="AUTO" className="bg-[#1a1d27]">Automóvil</option>
                <option value="SALUD" className="bg-[#1a1d27]">Salud</option>
                <option value="VIDA" className="bg-[#1a1d27]">Vida</option>
              </select>
            </div>

            {/* Aseguradora */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Aseguradora</label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <select
                  {...register('aseguradoraId')}
                  className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1a1d27]">Seleccionar...</option>
                  {aseguradoras.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#1a1d27]">{a.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subtipo */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subtipo / Cobertura</label>
              <input
                {...register('subtipo')}
                placeholder="Ej: Cobertura Completa"
                className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha de Inicio</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="date"
                  {...register('fechaInicio')}
                  className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Fecha Vencimiento */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha de Vencimiento</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="date"
                  {...register('fechaVencimiento')}
                  className={`w-full bg-black/20 border ${errors.fechaVencimiento ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'} rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all`}
                />
              </div>
            </div>

            {/* Monto */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Monto de Prima</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  {...register('monto')}
                  placeholder="0.00"
                  className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Frecuencia Pago */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Frecuencia de Pago</label>
              <select
                {...register('frecuenciaPago')}
                className="w-full bg-black/20 border border-white/10 focus:border-blue-500/50 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="MENSUAL" className="bg-[#1a1d27]">Mensual</option>
                <option value="TRIMESTRAL" className="bg-[#1a1d27]">Trimestral</option>
                <option value="SEMESTRAL" className="bg-[#1a1d27]">Semestral</option>
                <option value="ANUAL" className="bg-[#1a1d27]">Anual</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest py-4 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isEditing ? 'Actualizar Póliza' : 'Emitir Póliza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
