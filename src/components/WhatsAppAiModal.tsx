import React, { useState, useEffect } from 'react';
import { Lead } from '../types/lead';
import { MessageTemplate, MessageTone, INITIAL_TEMPLATES } from '../types/whatsapp';
import { generateWhatsAppMessageWithGroq, searchBusinessWebInfo } from '../services/groq';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Search, 
  Globe, 
  Key, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  ExternalLink, 
  FileText, 
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { createGoogleCalendarUrl } from '../utils/calendar';

interface WhatsAppAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAppendNotes?: (id: string, newNote: string) => void;
}

const STORAGE_GROQ_KEY = 'malatya_crm_groq_api_key';
const STORAGE_TEMPLATES_KEY = 'malatya_crm_custom_templates_v1';

export const WhatsAppAiModal: React.FC<WhatsAppAiModalProps> = ({
  isOpen,
  onClose,
  lead,
  onAppendNotes
}) => {
  // Groq API Key state
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_GROQ_KEY) || '';
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [model, setModel] = useState<string>('llama-3.3-70b-versatile');

  // Templates state
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEMPLATES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEMPLATES;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-1');
  const [selectedTone, setSelectedTone] = useState<MessageTone>('kurumsal');
  const [webResearchNotes, setWebResearchNotes] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [isSearchingWeb, setIsSearchingWeb] = useState<boolean>(false);

  // Output message
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Add/Edit template modal state
  const [isManagingTemplates, setIsManagingTemplates] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newTemplateForm, setNewTemplateForm] = useState<{
    title: string;
    category: 'all' | 'diş kliniği' | 'diyetisyen' | 'sigorta acentesi';
    tone: MessageTone;
    description: string;
    content: string;
  }>({
    title: '',
    category: 'all',
    tone: 'kurumsal',
    description: '',
    content: ''
  });

  // Save apiKey to localStorage
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_GROQ_KEY, key);
  };

  // Sync templates to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  // Set default template when lead changes
  useEffect(() => {
    if (lead) {
      setErrorMsg('');
      setCopied(false);
      // Auto-pick template matching category if possible
      const match = templates.find(t => t.category === lead.category);
      if (match) {
        setSelectedTemplateId(match.id);
        setSelectedTone(match.tone);
      } else {
        setSelectedTemplateId('tpl-1');
        setSelectedTone('kurumsal');
      }

      // Empty web research notes by default until user searches or types
      setWebResearchNotes('');

      // Pre-fill initial generated message with template placeholder
      const selectedTpl = match || templates[0];
      if (selectedTpl) {
        const initial = selectedTpl.content
          .replace(/{firma_adi}/g, lead.name)
          .replace(/{kategori}/g, lead.category)
          .replace(/{sehir}/g, lead.city)
          .replace(/{telefon}/g, lead.phone)
          .replace(/{notlar}/g, lead.notes || '');
        setGeneratedMessage(initial);
      }
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleWebResearch = async () => {
    setIsSearchingWeb(true);
    try {
      const results = await searchBusinessWebInfo(lead.name, lead.city);
      setWebResearchNotes(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await generateWhatsAppMessageWithGroq({
        lead,
        templateContent: currentTemplate.content,
        tone: selectedTone,
        webResearchNotes,
        customInstructions,
        apiKey,
        model
      });
      setGeneratedMessage(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mesaj oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const cleaned = lead.phone.replace(/\D/g, '');
    const phoneWithCountry = cleaned.startsWith('0') ? `9${cleaned}` : `90${cleaned}`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');

    // Automatically append note if handler exists
    if (onAppendNotes) {
      const stamp = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      onAppendNotes(lead.id, `[${stamp}] WhatsApp Mesajı Gönderildi: "${currentTemplate.title}"`);
    }
  };

  const handleSaveToNotes = () => {
    if (onAppendNotes) {
      const stamp = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      onAppendNotes(lead.id, `[${stamp} WhatsApp Şablonu]:\n${generatedMessage}`);
      alert('Mesaj başarıyla işletme notlarına eklendi!');
    }
  };

  // Template CRUD
  const handleSaveNewTemplate = () => {
    if (!newTemplateForm.title.trim() || !newTemplateForm.content.trim()) {
      alert('Lütfen şablon başlığı ve içeriğini doldurun.');
      return;
    }
    if (editingTemplate) {
      setTemplates(prev =>
        prev.map(t =>
          t.id === editingTemplate.id
            ? { ...t, ...newTemplateForm }
            : t
        )
      );
    } else {
      const newTpl: MessageTemplate = {
        id: `custom-tpl-${Date.now()}`,
        ...newTemplateForm
      };
      setTemplates(prev => [newTpl, ...prev]);
      setSelectedTemplateId(newTpl.id);
    }
    setIsManagingTemplates(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId('tpl-1');
      }
    }
  };

  const openGoogleCalendar = () => {
    const url = createGoogleCalendarUrl(lead);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Groq AI Destekli WhatsApp Mesaj Oluşturucu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Kişiye Özel
                </span>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">{lead.name}</strong> ({lead.category} • {lead.city} • {lead.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
              title="Groq API Anahtarını Yönet"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {apiKey ? 'API Anahtarı Tanımlı' : 'Groq API Key Ekle'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Banner (if clicked or not set) */}
        {showKeyInput && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs shrink-0 animate-in fade-in space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Groq API Ayarları (Llama 3.3 70B & 8B):
              </span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                Ücretsiz Groq Key Al <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Çok Zeki)</option>
                <option value="llama-3.1-8b-instant">Llama 3.1 8B (Işık Hızında)</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="mt-4 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 pr-1">
          {/* Left Column: Settings, Templates, Web Research (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Template Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Mesaj Şablonu:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTemplate(null);
                    setNewTemplateForm({
                      title: '',
                      category: 'all',
                      tone: 'kurumsal',
                      description: '',
                      content: ''
                    });
                    setIsManagingTemplates(true);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  Yeni Şablon Ekle
                </button>
              </div>

              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 italic">
                {currentTemplate.description}
              </p>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                İletişim Tonu:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'kurumsal', label: 'Kurumsal & Resmi' },
                  { id: 'samimi', label: 'Samimi & Sıcak' },
                  { id: 'ikna_edici', label: 'İkna Edici / Satış' },
                  { id: 'kisa_net', label: 'Kısa & Vurucu' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTone(item.id as MessageTone)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedTone === item.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Web Research Enrichment */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Web & Harita Araştırması:
                </span>
                <button
                  type="button"
                  onClick={handleWebResearch}
                  disabled={isSearchingWeb}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <Search className="w-3 h-3" />
                  <span>{isSearchingWeb ? 'Aranıyor...' : 'Webde Tara'}</span>
                </button>
              </div>

              <textarea
                rows={2}
                value={webResearchNotes}
                onChange={(e) => setWebResearchNotes(e.target.value)}
                placeholder="İşletme hakkında web/harita bilgisi veya özel vaka detayları..."
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Google'da İncele:</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    Google Arama <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(lead.name + ' ' + lead.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    Google Haritalar <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Custom Instruction */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Özel İstek / Ekstra Not (Opsiyonel):
              </label>
              <input
                type="text"
                placeholder="Örn: 'Ahmet Bey ile görüşülecek', 'Fiyata vurgu yapma'"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{isLoading ? 'Groq AI Mesajı Hazırlıyor...' : 'Groq AI İle Mesajı Üret'}</span>
            </button>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Output Message Preview & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>WhatsApp Mesaj Önizlemesi</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Düzenlenebilir)
                </span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Mesajı Kopyala"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToNotes}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Mesajı İşletmenin Notlarına Kaydet"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notlara Ekle</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Phone Mockup Container */}
            <div className="flex-1 min-h-[300px] p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-700/80 shadow-inner flex flex-col justify-between">
              {/* Message Header Mockup */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold text-slate-200">{lead.name}</span>
                </div>
                <span className="font-mono">{lead.phone}</span>
              </div>

              {/* Textarea for editable message */}
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                rows={11}
                className="w-full flex-1 p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed resize-none shadow-sm"
                placeholder="Mesaj burada görünecek..."
              />

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>*kalın metin*, _italik_, emojiler WhatsApp ile tam uyumludur.</span>
                <span>{generatedMessage.length} karakter</span>
              </div>
            </div>

            {/* Bottom Big Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={openGoogleCalendar}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Google Calendar'a Randevu Ekle</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp ile Doğrudan Gönder</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Manager / Add Custom Template Modal */}
      {isManagingTemplates && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                {editingTemplate ? 'Şablonu Düzenle' : 'Yeni WhatsApp Şablonu Ekle'}
              </h4>
              <button
                onClick={() => setIsManagingTemplates(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Şablon Başlığı *</label>
                <input
                  type="text"
                  placeholder="Örn: Diş Klinikleri İçin Özel Lansman Teklifi"
                  value={newTemplateForm.title}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hedef Sektör</label>
                  <select
                    value={newTemplateForm.category}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Tüm Sektörler</option>
                    <option value="diş kliniği">diş kliniği</option>
                    <option value="diyetisyen">diyetisyen</option>
                    <option value="sigorta acentesi">sigorta acentesi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Varsayılan Ton</label>
                  <select
                    value={newTemplateForm.tone}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, tone: e.target.value as MessageTone })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="kurumsal">Kurumsal</option>
                    <option value="samimi">Samimi</option>
                    <option value="ikna_edici">İkna Edici</option>
                    <option value="kisa_net">Kısa & Net</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kısa Açıklama</label>
                <input
                  type="text"
                  placeholder="Hangi durumlarda kullanılacağı hakkında özet bilgi"
                  value={newTemplateForm.description}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Şablon İçeriği (Değişkenlerle) *</label>
                  <span className="text-[10px] text-indigo-400">
                    Kullanılabilir: {'{firma_adi}'}, {'{kategori}'}, {'{sehir}'}, {'{notlar}'}
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Merhaba {firma_adi}, {sehir}'daki işletmeniz için..."
                  value={newTemplateForm.content}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsManagingTemplates(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveNewTemplate}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Şablonu Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
