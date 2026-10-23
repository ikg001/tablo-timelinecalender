import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Lead, LeadStatus } from '../types/lead';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight,
  Database,
  Layers,
  FileCheck
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: Lead[], mode: 'append' | 'replace') => void;
  currentCount: number;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<Lead[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processFile(selected);
    }
  };

  const processFile = (fileObj: File) => {
    setIsLoading(true);
    setErrorMsg('');
    setFile(fileObj);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('Yüklenen dosyada okunabilir veri satırı bulunamadı.');
          setIsLoading(false);
          return;
        }

        // Map columns dynamically
        const mapped: Lead[] = rawJson.map((row, index) => {
          const keys = Object.keys(row);

          const findKey = (candidates: string[]) => {
            const found = keys.find(k => {
              const lower = k.toLowerCase().trim();
              return candidates.some(c => lower.includes(c));
            });
            return found ? String(row[found]).trim() : '';
          };

          const name = findKey(['ad', 'firma', 'işletme', 'name', 'title', 'kurum']) || `İşletme #${index + 1}`;
          const category = findKey(['kategori', 'sektör', 'category', 'alan']) || 'Genel';
          const city = findKey(['şehir', 'il', 'city', 'konum']) || 'Malatya';
          const phone = findKey(['telefon', 'tel', 'phone', 'gsm', 'mobil']) || '-';
          const scoreRaw = findKey(['skor', 'puan', 'score', 'fırsat']);
          const opportunityScore = parseInt(scoreRaw, 10) || 50;
          const statusRaw = findKey(['durum', 'status', 'iletişim']).toLowerCase();
          
          let status: LeadStatus = 'aranmadi';
          if (statusRaw.includes('arandı') || statusRaw.includes('arandi')) status = 'arandi';
          else if (statusRaw.includes('tekrar')) status = 'tekrar_iletisime_gecilecek';
          else if (statusRaw.includes('web') || statusRaw.includes('site')) status = 'websitesi_eklendi';
          else if (statusRaw.includes('red')) status = 'red_alindi';
          else if (statusRaw.includes('olumlu') || statusRaw.includes('satış')) status = 'olumlu';

          const notes = findKey(['not', 'notlar', 'açıklama', 'notes', 'detay']);
          const followUpDate = findKey(['tarih', 'randevu', 'takip', 'date']);
          const addedDate = findKey(['eklenme', 'tarihi', 'created']) || new Date().toLocaleDateString('tr-TR');

          return {
            id: `import-${Date.now()}-${index}`,
            name,
            category,
            city,
            phone,
            originalStatus: 'yeni',
            opportunityScore,
            addedDate,
            status,
            notes,
            followUpDate
          };
        });

        setParsedLeads(mapped);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Dosya okunurken bir hata oluştu: ' + (err.message || 'Geçersiz dosya formatı.'));
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Dosya okunamadı. Lütfen geçerli bir Excel veya CSV dosyası seçin.');
      setIsLoading(false);
    };

    reader.readAsBinaryString(fileObj);
  };

  const handleConfirmImport = () => {
    if (parsedLeads.length === 0) return;
    onImport(parsedLeads, importMode);
    alert(`Başarıyla ${parsedLeads.length} işletme içeri aktarıldı!`);
    onClose();
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        'Ad': 'Örnek Malatya Diş Kliniği',
        'Kategori': 'diş kliniği',
        'Şehir': 'Malatya',
        'Telefon': '0532 000 00 00',
        'Fırsat Skoru': 85,
        'Durum': 'aranmadı',
        'Notlar': 'Görüşme yapılacak',
        'Takip Tarihi': '2026-10-30'
      },
      {
        'Ad': 'Örnek Beslenme ve Diyet Merkezi',
        'Kategori': 'diyetisyen',
        'Şehir': 'Malatya',
        'Telefon': '0544 111 22 33',
        'Fırsat Skoru': 70,
        'Durum': 'aranmadı',
        'Notlar': 'Online randevu istiyor',
        'Takip Tarihi': '2026-10-28'
      },
      {
        'Ad': 'Örnek Sigorta Acentesi',
        'Kategori': 'sigorta acentesi',
        'Şehir': 'Malatya',
        'Telefon': '0422 322 00 11',
        'Fırsat Skoru': 60,
        'Durum': 'aranmadı',
        'Notlar': '',
        'Takip Tarihi': ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'İşletmeler');
    XLSX.writeFile(wb, 'ornek-isletme-sablonu.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Excel & CSV Dosyası İçeri Aktar</span>
              </h3>
              <p className="text-xs text-slate-400">
                .xlsx, .xls veya .csv formatındaki işletme listenizi CRM'e yükleyin
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

        {/* Content */}
        <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950/90 transition-all flex flex-col items-center justify-center space-y-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-3 rounded-full bg-slate-900 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">
                {file ? file.name : 'Excel (.xlsx, .xls) veya CSV dosyanızı buraya sürükleyin ya da tıklayın'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sistem; Firma Adı, Kategori, Şehir, Telefon, Fırsat Skoru ve Not sütunlarını otomatik algılar.
              </p>
            </div>
          </div>

          {/* Download Sample Template helper */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">
              Doğru sütun formatını görmek ister misiniz?
            </span>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Örnek Excel Şablonu İndir</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedLeads.length > 0 && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <FileCheck className="w-4 h-4" />
                  <span>{parsedLeads.length} İşletme Okundu</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Mevcut Kayıt: {currentCount}
                </span>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setImportMode('append')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    importMode === 'append'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">Mevcut Verilere Ekle (Tavsiye)</div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Mevcut işletmeler korunur, yeni kayıtlar listeye dahil edilir.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    importMode === 'replace'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">Tüm Verileri Değiştir</div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Mevcut liste silinir, sadece bu dosyadaki kayıtlar geçerli olur.
                  </div>
                </button>
              </div>

              {/* Preview table (Top 4 rows) */}
              <div className="mt-2 overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="p-2">Firma Adı</th>
                      <th className="p-2">Kategori</th>
                      <th className="p-2">Telefon</th>
                      <th className="p-2">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedLeads.slice(0, 4).map((l, i) => (
                      <tr key={i} className="text-slate-300">
                        <td className="p-2 font-semibold truncate max-w-[160px]">{l.name}</td>
                        <td className="p-2 capitalize">{l.category}</td>
                        <td className="p-2 font-mono">{l.phone}</td>
                        <td className="p-2 font-bold text-emerald-400">{l.opportunityScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedLeads.length > 4 && (
                  <div className="p-1.5 text-center text-[10px] text-slate-500 bg-slate-900/60">
                    +{parsedLeads.length - 4} işletme daha içeri aktarılacak
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            İptal
          </button>

          <button
            type="button"
            disabled={parsedLeads.length === 0 || isLoading}
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{parsedLeads.length > 0 ? `${parsedLeads.length} İşletmeyi İçeri Aktar` : 'İçeri Aktar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
