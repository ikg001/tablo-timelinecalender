import { Lead } from '../types/lead';

/**
 * Generates a direct Google Calendar web event URL (works without API credentials).
 * Clicking this URL opens Google Calendar with the event title, date, notes, and location prefilled.
 */
export function createGoogleCalendarUrl(lead: Lead, customDate?: string): string {
  const title = encodeURIComponent(`Görüşme: ${lead.name} (${lead.category})`);
  
  // Parse date or fallback to tomorrow
  const targetDateStr = customDate || lead.followUpDate;
  let startDate: Date;
  
  if (targetDateStr) {
    startDate = new Date(targetDateStr);
    if (isNaN(startDate.getTime())) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
    }
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
  }

  // Set default appointment time to 14:00 (2:00 PM)
  startDate.setHours(14, 0, 0, 0);
  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 min duration

  const formatGCalDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;
  
  const details = encodeURIComponent(
    `Malatya İşletme CRM Görüşme Planı\n\n` +
    `Firma: ${lead.name}\n` +
    `Sektör: ${lead.category}\n` +
    `Telefon: ${lead.phone}\n` +
    `Fırsat Skoru: ${lead.opportunityScore}/100\n` +
    `Durum: ${lead.status}\n` +
    `Notlar: ${lead.notes || 'Not girilmemiş.'}\n\n` +
    `Oluşturan: Malatya Web Satış CRM Paneli`
  );

  const location = encodeURIComponent(`${lead.city}, Türkiye`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates an iCalendar (.ics) file content for a lead or multiple leads.
 * Allows downloading and importing into Google Calendar, Outlook, Apple Calendar.
 */
export function generateIcsContent(leads: Lead[]): string {
  const eventsWithDate = leads.filter(l => l.followUpDate);
  if (eventsWithDate.length === 0) return '';

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatIcsDate = (d: Date) => {
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      'Z'
    );
  };

  const nowStr = formatIcsDate(new Date());

  const eventStrings = eventsWithDate.map(lead => {
    const d = new Date(lead.followUpDate!);
    d.setHours(14, 0, 0);
    const end = new Date(d.getTime() + 45 * 60 * 1000);

    return [
      'BEGIN:VEVENT',
      `UID:${lead.id}-${Date.now()}@tablotimelinecalendar.local`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${formatIcsDate(d)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:Görüşme: ${lead.name}`,
      `DESCRIPTION:${(lead.notes || 'CRM Takip Randevusu').replace(/\n/g, '\\n')}\\nTelefon: ${lead.phone}`,
      `LOCATION:${lead.city}\\, Türkiye`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tablo Timeline Calendar CRM//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...eventStrings,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Downloads the .ics file directly in browser
 */
export function downloadIcsFile(leads: Lead[], filename = 'malatya-randevular.ics') {
  const content = generateIcsContent(leads);
  if (!content) {
    alert('Takip / Randevu tarihi belirlenmiş herhangi bir işletme bulunamadı.');
    return;
  }
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
