import { Lead } from '../types/lead';
import { MessageTone } from '../types/whatsapp';

export interface GenerateMessageParams {
  lead: Lead;
  templateContent: string;
  tone: MessageTone;
  webResearchNotes?: string;
  customInstructions?: string;
  apiKey?: string;
  model?: string;
}

const TONE_INSTRUCTIONS: Record<MessageTone, string> = {
  kurumsal: 'Resmi, saygılı, kurumsal bir Türkçe dili kullan. Profesyonel ve güven verici ol.',
  samimi: 'Samimi, sıcak, yapaylıktan uzak, arkadaşça ama iş ahlakına uygun bir dil kullan.',
  ikna_edici: 'Değer önerisini öne çıkaran, işletmenin kazanacağı faydaları (daha fazla hasta/müşteri, Google sıralaması, prestij) vurgulayan ikna edici bir dil kullan.',
  kisa_net: 'Çok kısa, öz, 2-3 cümleyi geçmeyen, doğrudan soru veya aksiyon çağrısı içeren hızlı bir mesaj olsun.'
};

/**
 * Searches the web for business information using DuckDuckGo / Open Search API
 * to enrich the context before generating the message.
 */
export async function searchBusinessWebInfo(businessName: string, city: string = 'Malatya'): Promise<string> {
  const query = `${businessName} ${city}`;
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const abstract = data.AbstractText || '';
      const related = (data.RelatedTopics || [])
        .slice(0, 3)
        .map((t: any) => t.Text)
        .filter(Boolean)
        .join('; ');

      if (abstract || related) {
        return `Web Arama Bilgileri: ${abstract} ${related}`;
      }
    }
  } catch (error) {
    console.warn('DuckDuckGo search error (falling back to smart local context):', error);
  }

  // Smart local sector knowledge fallback if network search is blocked or empty
  return `${city} merkezinde faaliyet gösteren kurumsal bir işletme. Google aramalarında bölgedeki müşterilerin ilgisini çekebilecek potansiyele sahip.`;
}

/**
 * Generates a hyper-personalized WhatsApp message using Groq API (or smart local engine if key is absent).
 */
export async function generateWhatsAppMessageWithGroq({
  lead,
  templateContent,
  tone,
  webResearchNotes,
  customInstructions,
  apiKey,
  model = 'llama-3.3-70b-versatile'
}: GenerateMessageParams): Promise<string> {
  // Replace variables in base template
  let populatedTemplate = templateContent
    .replace(/{firma_adi}/g, lead.name)
    .replace(/{kategori}/g, lead.category)
    .replace(/{sehir}/g, lead.city || 'Malatya')
    .replace(/{telefon}/g, lead.phone || '')
    .replace(/{notlar}/g, lead.notes || 'Özel not bulunmuyor.')
    .replace(/{firsat_skoru}/g, String(lead.opportunityScore || 50));

  // If no Groq API Key is provided, use the smart local prompt populated template
  if (!apiKey || !apiKey.trim()) {
    // Return populated template with a helpful disclaimer note
    return populatedTemplate;
  }

  const systemPrompt = `Sen Türkiye pazarında çalışan deneyimli bir B2B Satış ve Dijital Pazarlama Uzmanısın.
Görevin, ${lead.city} şehrinde bulunan işletmelere (özellikle diş poliklinikleri, diyetisyenler ve sigorta acenteleri) web sitesi satışı ve dijital varlık güçlendirme için yüksek dönüşüm sağlayan WhatsApp mesajları yazmaktır.

Kurallar:
1. Mesaj WhatsApp için optimize edilmelidir: Okunması kolay, paragraflar arası boşluklu, uygun yerlerde WhatsApp emojileri (🦷, 🌐, 📱, ✨, 💼 vb.) ve kalın metinler (*örnek*) içermelidir.
2. Ton talimatı: ${TONE_INSTRUCTIONS[tone]}
3. Mesaj gereksiz klişelerden veya sahte yapay zeka ifadelerinden uzak, doğal ve doğrudan işletme sahibine hitap eden bir dilde olmalıdır.
4. Çıktı olarak SADECE gönderilecek WhatsApp mesaj metnini üret. Başlık, açıklama veya ek not ekleme.`;

  const userPrompt = `Aşağıdaki işletme bilgileri ve şablonu kullanarak kişiselleştirilmiş bir WhatsApp mesajı oluştur:

İŞLETME BİLGİLERİ:
- Firma Adı: ${lead.name}
- Sektör / Kategori: ${lead.category}
- Şehir: ${lead.city}
- Telefon: ${lead.phone}
- Fırsat Skoru: ${lead.opportunityScore}/100
- Daha Önce Alınan Notlar: ${lead.notes || 'Yok'}

${webResearchNotes ? `WEB / İNTERNET ARAŞTIRMA BİLGİSİ:\n${webResearchNotes}\n` : ''}
${customInstructions ? `KULLANICI ÖZEL TALİMATI:\n${customInstructions}\n` : ''}

BAZ ALINACAK ŞABLON:
"""
${populatedTemplate}
"""

Lütfen yukarıdaki şablonu işletmeye, sektöre ve verilen ek bilgilere göre özelleştirerek en etkili WhatsApp mesajını üret.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || response.statusText;
      throw new Error(`Groq API Hatası (${response.status}): ${msg}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();
    return result || populatedTemplate;
  } catch (error: any) {
    console.error('Groq generation error:', error);
    throw error;
  }
}
