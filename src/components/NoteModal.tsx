import React, { useState, useEffect } from 'react';
import { Lead } from '../types/lead';
import { X, StickyNote, Plus, Tag, Clock, Save, Sparkles, Trash2, Mic, MicOff } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveNotes: (id: string, notes: string) => void;
}

const QUICK_TAGS = [
  '📞 Arandı, ulaşılamadı',
  '💰 Fiyat teklifi istendi',
  '🌐 Demo web sitesi gösterildi',
  '🤝 Yetkiliyle olumlu görüşüldü',
  '⏳ Karar için süre istendi',
  '🚫 Şu an web sitesi düşünmüyor',
  '📱 WhatsApp üzerinden katalog atıldı'
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSaveNotes
}) => {
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (lead) {
      setNoteText(lead.notes || '');
    }
  }, [lead, isOpen]);

  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız sesle yazmayı desteklemiyor. Lütfen Chrome veya Edge kullanın.');
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

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setNoteText(prev => prev.trim() ? `${prev.trim()}\n${transcript}` : transcript);
        }
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  if (!isOpen || !lead) return null;

  const handleSave = () => {
    onSaveNotes(lead.id, noteText);
    onClose();
  };

  const addQuickTag = (tag: string) => {
    const timestamp = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const formattedTag = `[${timestamp}] ${tag}`;
    if (noteText.trim()) {
      setNoteText(prev => `${prev}\n${formattedTag}`);
    } else {
      setNoteText(formattedTag);
    }
  };

  const addTimestamp = () => {
    const timestamp = new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    const prefix = `\n[${timestamp}]: `;
    setNoteText(prev => `${prev.trim()}${prefix}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Görüşme Notları</span>
                <span className="text-xs font-normal text-slate-400">({lead.category})</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium truncate max-w-sm">
                {lead.name}
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

        {/* Quick Tag Templates */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Hızlı Not Şablonları (Tıklayıp Ekle):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800'
                }`}
              >
                {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{isRecording ? 'Dinleniyor...' : 'Sesle Yazdır'}</span>
              </button>

              <button
                type="button"
                onClick={addTimestamp}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                <Clock className="w-3 h-3" />
                Tarih Ekle
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addQuickTag(tag)}
                className="px-2 py-1 rounded-md text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-600 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            İşletme İle İlgili Notlar ve Görüşme Detayları:
          </label>
          <textarea
            rows={6}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Müşteri görüşmesi, teklif ayrıntıları, aranacak kişi veya özel talepleri buraya yazın..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
            <span>Yazdığınız notlar otomatik olarak işletmeye bağlanır.</span>
            <span>{noteText.length} karakter</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setNoteText('')}
            className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Notu Temizle</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Notu Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
