import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, STATUS_OPTIONS } from '../types/lead';
import { X, Building2, Phone, Calendar, Sparkles } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: any) => void;
  initialLead?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'diş kliniği',
    city: 'Malatya',
    phone: '',
    originalStatus: 'yeni',
    opportunityScore: 50,
    addedDate: new Date().toLocaleDateString('tr-TR'),
    status: 'aranmadi' as LeadStatus,
    notes: '',
    followUpDate: ''
  });

  useEffect(() => {
    if (initialLead) {
      setFormData({
        name: initialLead.name,
        category: initialLead.category,
        city: initialLead.city,
        phone: initialLead.phone,
        originalStatus: initialLead.originalStatus || 'yeni',
        opportunityScore: initialLead.opportunityScore || 50,
        addedDate: initialLead.addedDate || new Date().toLocaleDateString('tr-TR'),
        status: initialLead.status || 'aranmadi',
        notes: initialLead.notes || '',
        followUpDate: initialLead.followUpDate || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'diş kliniği',
        city: 'Malatya',
        phone: '',
        originalStatus: 'yeni',
        opportunityScore: 50,
        addedDate: new Date().toLocaleDateString('tr-TR'),
        status: 'aranmadi',
        notes: '',
        followUpDate: ''
      });
    }
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Lütfen işletme adını giriniz.');
      return;
    }
    if (initialLead) {
      onSave({ ...initialLead, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialLead ? 'İşletme Bilgilerini Güncelle' : 'Yeni İşletme Ekle'}
              </h3>
              <p className="text-xs text-slate-400">
                {initialLead ? initialLead.name : 'Malatya veritabanına yeni işletme kaydı ekleyin'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              İşletme / Kurum Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Özel Park Diş Kliniği"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="diş kliniği">diş kliniği</option>
                <option value="diyetisyen">diyetisyen</option>
                <option value="sigorta acentesi">sigorta acentesi</option>
                <option value="diğer">diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Şehir
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telefon Numarası
              </label>
              <input
                type="text"
                placeholder="05xx xxx xx xx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fırsat Skoru (0-100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.opportunityScore}
                onChange={(e) => setFormData({ ...formData, opportunityScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Ekstra İstenen 3 Alan */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-3">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
              Ekstra CRM Alanları
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. İletişim Durumu
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {(Object.keys(STATUS_OPTIONS) as LeadStatus[]).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_OPTIONS[st].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  3. Takip / Randevu Tarihi
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                2. Görüşme Notları / Açıklama
              </label>
              <textarea
                rows={2}
                placeholder="Görüşme detayları, konuşulanlar, yetkili ismi vb."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              {initialLead ? 'Değişiklikleri Kaydet' : 'İşletmeyi Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
