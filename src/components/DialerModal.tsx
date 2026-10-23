import React, { useState } from 'react';
import { Lead, LeadStatus, STATUS_OPTIONS } from '../types/lead';
import { 
  X, 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  FileText, 
  Calendar, 
  Mic, 
  MicOff, 
  Save, 
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';
import { StatusDropdown } from './StatusDropdown';

interface DialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpenWhatsAppAi: (lead: Lead) => void;
  onOpenProposal: (lead: Lead) => void;
  onOpenGoogleCalendar: (lead: Lead) => void;
}

export const DialerModal: React.FC<DialerModalProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateStatus,
  onUpdateNotes,
  onOpenWhatsAppAi,
  onOpenProposal,
  onOpenGoogleCalendar
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  if (!isOpen || leads.length === 0) return null;

  const currentLead = leads[currentIndex] || leads[0];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < leads.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Web Speech API Voice-to-Text
  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız sesle yazmayı desteklemiyor. Chrome veya Edge kullanabilirsiniz.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const updated = currentLead.notes ? `${currentLead.notes} ${transcript}` : transcript;
          onUpdateNotes(currentLead.id, updated);
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const completedCount = leads.filter(l => l.status !== 'aranmadi').length;
  const progressPercent = Math.round((completedCount / leads.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Hızlı Arama & Satış Odak Modu</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {currentIndex + 1} / {leads.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sırayla arayın, notları kaydedin, WhatsApp ve teklif gönderin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Genel Arama İlerlemesi</span>
            <span className="font-mono text-emerald-400">%{progressPercent} ({completedCount}/{leads.length})</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Lead Card */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {currentLead.category}
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5 leading-snug">
                {currentLead.name}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{currentLead.city}</span>
                <span>•</span>
                <span>Kayıt: {currentLead.addedDate}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-400 block">Fırsat Skoru</span>
              <span className="text-xl font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 inline-block mt-0.5">
                {currentLead.opportunityScore}
              </span>
            </div>
          </div>

          {/* Big Call Button & Quick Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${currentLead.phone.replace(/\s+/g, '')}`}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
            >
              <Phone className="w-4 h-4" />
              <span>Hemen Ara: {currentLead.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenWhatsAppAi(currentLead)}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Groq AI ile WhatsApp Hazırla</span>
            </button>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-850">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                İletişim Durumu:
              </label>
              <StatusDropdown
                currentStatus={currentLead.status}
                onSelect={(st) => onUpdateStatus(currentLead.id, st)}
              />
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenProposal(currentLead)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teklif Hazırla</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenGoogleCalendar(currentLead)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Takvime Ekle</span>
              </button>
            </div>
          </div>

          {/* Live Notes with Voice-to-Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Görüşme Notları:
              </label>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Sesle Konuşarak Not Al"
              >
                {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-indigo-400" />}
                <span>{isRecording ? 'Dinleniyor... (Konuşun)' : 'Sesle Yazdır'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={currentLead.notes || ''}
              onChange={(e) => onUpdateNotes(currentLead.id, e.target.value)}
              placeholder="Konuşulan detayları, müşteri itirazlarını veya anlaşma şartlarını yazın..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Navigation Next / Prev */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki İşletme</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === leads.length - 1}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Sonraki İşletmeye Geç</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
