import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { INITIAL_LEADS } from '../data/initialLeads';

const STORAGE_KEY = 'malatya_leads_crm_v1';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load leads from localStorage', e);
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage', e);
    }
  }, [leads]);

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const updateLeadNotes = (id: string, notes: string) => {
    setLeads(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, notes, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const updateLeadFollowUpDate = (id: string, followUpDate: string) => {
    setLeads(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, followUpDate, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const updateLead = (updated: Lead) => {
    setLeads(prev =>
      prev.map(item =>
        item.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const addLead = (newLead: Omit<Lead, 'id'>) => {
    const id = `lead-${Date.now()}`;
    const lead: Lead = {
      ...newLead,
      id,
      updatedAt: new Date().toISOString()
    };
    setLeads(prev => [lead, ...prev]);
    return lead;
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(item => item.id !== id));
  };

  const resetToInitial = () => {
    if (window.confirm('Tüm verileri ilk 64 orijinal işletme kaydına sıfırlamak istediğinize emin misiniz?')) {
      setLeads(INITIAL_LEADS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Firma Adı',
      'Kategori',
      'Şehir',
      'Telefon',
      'Orijinal Durum',
      'Fırsat Skoru',
      'Eklenme Tarihi',
      'İletişim Durumu (Ekstra 1)',
      'Görüşme Notları (Ekstra 2)',
      'Takip / Randevu Tarihi (Ekstra 3)'
    ];

    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.city}"`,
      `"${l.phone}"`,
      `"${l.originalStatus}"`,
      l.opportunityScore,
      `"${l.addedDate}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.followUpDate || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `malatya-isletmeler-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    leads,
    updateLeadStatus,
    updateLeadNotes,
    updateLeadFollowUpDate,
    updateLead,
    addLead,
    deleteLead,
    resetToInitial,
    exportToCSV
  };
}
