export type LeadStatus = 
  | 'aranmadi'
  | 'arandi'
  | 'tekrar_iletisime_gecilecek'
  | 'websitesi_eklendi'
  | 'red_alindi'
  | 'olumlu';

export interface Lead {
  id: string;
  name: string;
  category: 'diş kliniği' | 'diyetisyen' | 'sigorta acentesi' | string;
  city: string;
  phone: string;
  originalStatus: string;
  opportunityScore: number;
  addedDate: string;
  
  // Ekstra 3 Sütun (User requirements + modern CRM)
  status: LeadStatus;          // 1. Durum (Dropdown): aranmadı, arandı, tekrar iletişime geçilecek, websitesi eklendi, red alındı, olumlu
  notes: string;               // 2. Notlar / Görüşme Detayı
  followUpDate?: string;       // 3. Takip / Randevu Tarihi (Timeline & Takvim için)
  
  // Opsiyonel ek alanlar
  websiteUrl?: string;
  updatedAt?: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
}

export const STATUS_OPTIONS: Record<LeadStatus, StatusConfig> = {
  aranmadi: {
    label: 'Aranmadı',
    color: 'text-slate-300',
    bg: 'bg-slate-800/80',
    border: 'border-slate-700',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-600/40'
  },
  arandi: {
    label: 'Arandı',
    color: 'text-blue-300',
    bg: 'bg-blue-950/60',
    border: 'border-blue-700',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  tekrar_iletisime_gecilecek: {
    label: 'Tekrar İletişime Geçilecek',
    color: 'text-amber-300',
    bg: 'bg-amber-950/60',
    border: 'border-amber-700',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  websitesi_eklendi: {
    label: 'Websitesi Eklendi',
    color: 'text-emerald-300',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-700',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  red_alindi: {
    label: 'Red Alındı',
    color: 'text-rose-300',
    bg: 'bg-rose-950/60',
    border: 'border-rose-700',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  olumlu: {
    label: 'Olumlu / Anlaşıldı',
    color: 'text-purple-300',
    bg: 'bg-purple-950/60',
    border: 'border-purple-700',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  }
};
