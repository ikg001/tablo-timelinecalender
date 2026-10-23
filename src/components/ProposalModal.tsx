import React, { useState, useEffect } from 'react';
import { Lead } from '../types/lead';
import { 
  X, 
  FileText, 
  Printer, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Crown,
  DollarSign,
  Building2,
  Calendar,
  Phone
} from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveDealValue?: (id: string, dealValue: number) => void;
  onAppendNotes?: (id: string, note: string) => void;
}

interface ProposalPackage {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  features: string[];
  popular?: boolean;
}

const DEFAULT_PACKAGES: ProposalPackage[] = [
  {
    id: 'starter',
    name: 'Standart Kurumsal Web Paketi',
    icon: <Zap className="w-4 h-4 text-cyan-400" />,
    price: 12500,
    features: [
      'Modern, Hızlı ve Mobil Uyumlu Tasarım',
      '5 Sayfa (Hakkımızda, Hizmetler, Galeri, İletişim vb.)',
      'WhatsApp ve Tek Tıkla Arama Butonları',
      'Google Haritalar & SEO Temel Kurulumu',
      'Ücretsiz SSL Güvenlik Sertifikası',
      '1 Yıl Ücretsiz Hosting ve Alan Adı Desteği'
    ]
  },
  {
    id: 'pro',
    name: 'Gelişmiş Klinik & Acente Randevu Paketi',
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    price: 19500,
    popular: true,
    features: [
      'Standart Paketin Tüm Özellikleri',
      'Online Randevu / Teklif Talep Sistemi',
      'Hasta/Danışan Ön Bilgilendirme ve Vaka Galerisi',
      'Hızlı SMS / WhatsApp Randevu Bildirimi',
      'Google PageSpeed %90+ Hız Optimizasyonu',
      'Kurumsal E-posta Hesapları (5 Adet)',
      '1 Yıl Öncelikli Teknik Destek'
    ]
  },
  {
    id: 'vip',
    name: 'VIP Dijital Dönüşüm & SEO Paketi',
    icon: <Crown className="w-4 h-4 text-amber-400" />,
    price: 29500,
    features: [
      'Pro Randevu Paketinin Tüm Özellikleri',
      'Malatya Bölgesel Google SEO Sıralama Çalışması',
      'Google İşletmem / Haritalar 5 Yıldız Yönetim Rehberi',
      'Instagram & Sosyal Medya Profil Entegrasyonu',
      'Özel Yönetim Paneli (İçeriklerinizi Kolayca Değiştirin)',
      'Aylık Ziyaretçi ve Randevu Raporlaması',
      '7/24 Kesintisiz VIP Destek'
    ]
  }
];

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSaveDealValue,
  onAppendNotes
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pro');
  const [customPrice, setCustomPrice] = useState<number>(19500);
  const [validDays, setValidDays] = useState<number>(15);
  const [notes, setNotes] = useState<string>('Teklif onaylandıktan sonra web sitesi 7 iş günü içinde yayına alınacaktır.');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (lead) {
      // Auto-adapt package price if lead has dealValue
      if (lead.dealValue) {
        setCustomPrice(lead.dealValue);
      } else {
        const pkg = DEFAULT_PACKAGES.find(p => p.id === selectedPackageId);
        if (pkg) setCustomPrice(pkg.price);
      }
    }
  }, [lead, selectedPackageId, isOpen]);

  if (!isOpen || !lead) return null;

  const currentPkg = DEFAULT_PACKAGES.find(p => p.id === selectedPackageId) || DEFAULT_PACKAGES[1];

  const handlePackageSelect = (pkg: ProposalPackage) => {
    setSelectedPackageId(pkg.id);
    setCustomPrice(pkg.price);
  };

  const handlePrint = () => {
    if (onSaveDealValue) {
      onSaveDealValue(lead.id, customPrice);
    }
    window.print();
  };

  const generateWhatsAppProposalText = () => {
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(customPrice);
    return `Sayın ${lead.name} Yetkilisi,

${lead.city}'daki işletmeniz için hazırladığımız özel web sitesi ve dijital dönüşüm teklif detaylarımız aşağıdadır:

📋 *Seçilen Paket:* ${currentPkg.name}
💰 *Yatırım Bedeli:* ${formattedPrice} ₺ (KDV Dahil)
⏳ *Teslim Süresi:* 7 İş Günü
📅 *Teklif Geçerlilik:* ${validDays} Gün

*Paket İçeriği:*
${currentPkg.features.map(f => `• ${f}`).join('\n')}

*Ek Not:* ${notes}

Canlı demomuzu incelemek ve detayları görüşmek üzere uygun olduğunuz bir vakti paylaşabilir misiniz?

İyi çalışmalar dileriz.`;
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppProposalText();
    const cleaned = lead.phone.replace(/\D/g, '');
    const phoneWithCountry = cleaned.startsWith('0') ? `9${cleaned}` : `90${cleaned}`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    if (onSaveDealValue) {
      onSaveDealValue(lead.id, customPrice);
    }
    if (onAppendNotes) {
      const stamp = new Date().toLocaleDateString('tr-TR');
      onAppendNotes(lead.id, `[${stamp}] Teklif Gönderildi: ${currentPkg.name} (${customPrice} ₺)`);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateWhatsAppProposalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 my-auto max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Kurumsal Web Sitesi Teklif Oluşturucu</span>
              </h3>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">{lead.name}</strong> için kişiye özel fiyat teklifi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Yazdır veya PDF Olarak Kaydet"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>PDF / Yazdır</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-4 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 pr-1">
          {/* Left: Package Selector & Settings (5 cols) - Hidden in Print */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">
                Teklif Paketi Seçin:
              </label>
              <div className="space-y-2">
                {DEFAULT_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-xs text-white">
                          {pkg.icon}
                          <span>{pkg.name}</span>
                        </div>
                        {pkg.popular && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            En Çok Tercih Edilen
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-indigo-300 mt-1">
                        {new Intl.NumberFormat('tr-TR').format(pkg.price)} ₺
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Price & Settings */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200">
                Fiyat & Teklif Ayarları
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Teklif Edilen Fiyat (₺):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ₺
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Geçerlilik (Gün):
                  </label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Teslim Süresi:
                  </label>
                  <input
                    type="text"
                    value="7 İş Günü"
                    readOnly
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Özel Not / Taahhüt:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Teklifi WhatsApp ile Gönder</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Metin Kopyalandı' : 'WhatsApp Teklif Metnini Kopyala'}</span>
              </button>
            </div>
          </div>

          {/* Right: The Printable Proposal Document (7 cols) */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between print:col-span-12 print:p-0 print:shadow-none print:rounded-none">
            {/* Proposal Document Header */}
            <div>
              <div className="flex items-start justify-between border-b pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-lg sm:text-xl">
                    <Building2 className="w-6 h-6" />
                    <span>DİJİTAL WEB & ÇÖZÜM AJANSI</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kurumsal Web Tasarım, SEO & Yazılım Çözümleri
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <div className="font-bold text-slate-800">TEKLİF NO: #TKL-{Date.now().toString().slice(-5)}</div>
                  <div>Tarih: {formattedDate}</div>
                  <div>Geçerlilik: {validDays} Gün</div>
                </div>
              </div>

              {/* Client Info Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">MÜŞTERİ BİLGİSİ</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{lead.name}</h4>
                  <div className="text-xs text-slate-600 capitalize">
                    {lead.category} • {lead.city}, Türkiye
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-slate-700 font-semibold">
                  {lead.phone}
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900">
                    {currentPkg.name}
                  </h5>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Kişiye Özel Çözüm
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-semibold text-slate-800">Paket Kapsamındaki Hizmetler:</div>
                  <ul className="space-y-1.5 pl-1">
                    {currentPkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {notes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <strong>Özel Not:</strong> {notes}
                  </div>
                )}
              </div>
            </div>

            {/* Price Total & Signature */}
            <div className="pt-6 border-t mt-6">
              <div className="flex items-center justify-between mb-6 bg-slate-900 text-white p-4 rounded-xl">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Toplam Yatırım Tutarı</div>
                  <div className="text-xs text-slate-300">Tüm altyapı ve kurulum dahil</div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {new Intl.NumberFormat('tr-TR').format(customPrice)} ₺
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-xs text-slate-500 pt-2">
                <div>
                  <div className="border-b pb-8 mb-1"></div>
                  <span className="font-semibold text-slate-700">Teklif Veren (Ajans)</span>
                </div>
                <div>
                  <div className="border-b pb-8 mb-1"></div>
                  <span className="font-semibold text-slate-700">Müşteri Onayı / Kaşe İmza</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
