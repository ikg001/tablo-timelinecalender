export type MessageTone = 'kurumsal' | 'samimi' | 'ikna_edici' | 'kisa_net';

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'all' | 'diş kliniği' | 'diyetisyen' | 'sigorta acentesi';
  tone: MessageTone;
  content: string; // The base template with variables like {firma_adi}, {kategori}, {sehir}, {notlar}
  description: string;
}

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-1',
    title: '🌐 Modern Web Sitesi Teklifi (Genel)',
    category: 'all',
    tone: 'kurumsal',
    description: 'İşletmenin dijital varlığını güçlendirmek ve randevu/müşteri akışını artırmak için özel web teklifi.',
    content: `Merhaba {firma_adi} ekibi,

{sehir}'daki başarılı çalışmalarınızı ve hasta/müşteri memnuniyetinizi takdirle takip ediyoruz. 

Günümüzde danışanların %80'i ilk tercihlerini mobil uyumlu, hızlı ve modern bir web sitesi üzerinden randevu alarak yapıyor. {firma_adi} için özel olarak hazırladığımız; Google'da üst sıralara çıkan, online randevu ve WhatsApp entegrasyonlu modern web sitesi konseptimizi sizinle paylaşmak isteriz.

Bu hafta içi kısa bir online demo veya kahve eşliğinde tanıtımımız için uygun olduğunuz bir gün var mıdır?

Saygılarımızla,
Dijital Çözüm Ekibi`
  },
  {
    id: 'tpl-2',
    title: '🦷 Diş Klinikleri İçin Özel Randevu & İmplant/Gülüş Tasarımı',
    category: 'diş kliniği',
    tone: 'ikna_edici',
    description: 'Diş hekimleri ve poliklinikler için tedavi tanıtımı ve online randevu odaklı.',
    content: `Merhaba {firma_adi} Yöneticisi,

{sehir}'da diş sağlığı alanında sunduğunuz kaliteli hizmetleri ilgiyle takip ediyoruz. 

Kliniklerin dijitalde en çok ihtiyaç duyduğu; implant, gülüş tasarımı ve ortodonti hastalarına güven veren, referans vakaları sergileyen ve doğrudan WhatsApp/telefonla randevu oluşturan özel klinik web altyapımız hakkında size bilgi vermek istedik.

{firma_adi}'na özel hazırladığımız canlı demo arayüzünü incelemek ister misiniz? Size 5 dakikalık bir önizleme linki iletebilirim.

İyi çalışmalar dileriz!`
  },
  {
    id: 'tpl-3',
    title: '🥗 Diyetisyen & Beslenme Danışmanlığı Özel Şablonu',
    category: 'diyetisyen',
    tone: 'samimi',
    description: 'Online danışmanlık, beslenme paketleri ve randevu akışı odaklı samimi mesaj.',
    content: `Merhabalar {firma_adi},

{sehir}'daki danışanlarınız için paylaştığınız motive edici içerikleri ve başarılarınızı keyifle takip ediyoruz! ✨

Online danışmanlık, diyet paketleri satışı ve danışan takip süreçlerini kolaylaştıran, şık ve mobil uyumlu kişisel web siteleri tasarlıyoruz. Danışanlarınızın doğrudan profilinizi inceleyip kolayca randevu alabileceği bir web sitesi çalışmamız var.

{firma_adi} adına hazırladığımız demo tasarımını size WhatsApp üzerinden göndermemi ister misiniz? 🌿`
  },
  {
    id: 'tpl-4',
    title: '🛡️ Sigorta Acenteleri İçin Hızlı Teklif & Poliçe Sistemi',
    category: 'sigorta acentesi',
    tone: 'kurumsal',
    description: 'Kasko, trafik ve sağlık sigortası için online teklif formu odaklı.',
    content: `Sayın {firma_adi} Yetkilisi,

{sehir} bölgesinde sigortacılık alanındaki güvenilir ve köklü hizmetlerinizi biliyoruz. 

Müşterilerin 7/24 kasko, trafik ve tamamlayıcı sağlık sigortası için anında teklif talebi bırakabileceği, lisanslı ve kurumsal bir web sitesi altyapısı sunuyoruz. Bu sistemle bölgenizdeki potansiyel poliçe taleplerini %40 daha fazla doğrudan WhatsApp ve telefonunuza yönlendirebilirsiniz.

Detayları ve size özel hazırladığımız arayüzü kısaca görüşmek üzere müsait bir vaktinizi rica edebilir miyiz?

İyi günler dileriz.`
  },
  {
    id: 'tpl-5',
    title: '⚡ Kısa & Net Tanışma Mesajı',
    category: 'all',
    tone: 'kisa_net',
    description: 'Yoğun işletmeler için 2-3 cümlelik, doğrudan aksiyon odaklı mesaj.',
    content: `Merhaba {firma_adi}, 

{sehir}'daki işletmeniz için Google aramalarda öne çıkaran, online randevu & WhatsApp butonlu yeni nesil web sitesi demosu hazırladık. 

Demo linkini incelemeniz için gönderebilir miyim? Teşekkürler, iyi çalışmalar!`
  }
];
