# Malatya İşletme CRM & Web Satış Yönetim Paneli

Malatya'daki **diş klinikleri**, **diyetisyenler** ve **sigorta acenteleri** (toplam 64 işletme) için geliştirilmiş modern, etkileşimli CRM, zaman çizelgesi (timeline) ve takvim yönetim platformu.

## 🚀 Öne Çıkan Özellikler

### 1. 📋 Zengin Tablo Sistemi (Table View)
- **Orijinal Veriler**: İşletme Adı, Kategori, Şehir (Malatya), Telefon, Orijinal Durum, Fırsat Skoru, Eklenme Tarihi.
- **Ekstra 3 Sütun (İstenen Özellikler)**:
  1. **İletişim / Süreç Durumu (Dropdown)**:
     - ⚪ `Aranmadı`
     - 🔵 `Arandı`
     - 🟡 `Tekrar İletişime Geçilecek`
     - 🟢 `Websitesi Eklendi` (Konfeti kutlamalı)
     - 🔴 `Red Alındı`
     - 🟣 `Olumlu / Anlaşıldı`
  2. **Görüşme Notları**: Tablo üzerinden anında düzenlenebilir, müşteriyle yapılan görüşme detaylarını saklar.
  3. **Takip / Randevu Tarihi**: Tarih seçici ile sonraki arama veya toplantı tarihini belirler.
- **Hızlı İletişim Aksiyonları**:
  - Tek tıkla telefon araması (`tel:`)
  - Tek tıkla WhatsApp mesajı başlatma (`wa.me`)
  - İşletme düzenleme & silme

### 2. ⏳ Zaman Çizelgesi (Timeline View)
- Planlanmış takipler, arama bekleyen işletmeler ve tamamlanan web siteleri kronolojik bloklar halinde sunulur.

### 3. 📅 Etkileşimli Takvim (Calendar View)
- Randevu veya takip tarihi atanmış firmaları takvim üzerinde gün bazında gösterir.

### 4. 📊 Detaylı Analitik & İstatistik (Analytics View)
- Sektör dağılımı (Diş Klinikleri, Diyetisyenler, Sigortalar), durum yüzdeleri, dönüşüm oranları ve en yüksek fırsat skoruna sahip firmalar.

### 5. 💾 Veri Güvenliği & Dışa Aktarma
- `localStorage` desteği ile tüm durum ve not değişiklikleri tarayıcıda kalıcı olarak saklanır.
- **CSV / Excel İndir**: Tek tıkla tüm listeyi dışa aktarabilirsiniz.
- **İlk Duruma Sıfırla**: İstenildiğinde 64 orijinal işletme kaydına anında dönebilme.

---

## 🛠️ Kullanılan Teknolojiler
- **React 19 & TypeScript**: Tip güvenli, performanslı arayüz bileşenleri.
- **Vite 6**: Süper hızlı geliştirme ve build performansı.
- **Tailwind CSS v4**: Modern, koyu temalı (dark mode) şık cam (glassmorphism) tasarım.
- **Lucide React**: Zengin, modern ikon seti.
- **Canvas-Confetti**: Başarılı satış ve web sitesi ekleme durumlarında görsel kutlama.

---

## 🌐 Canlı Bağlantılar (Live Demo)

- 🔗 **Canlı Web Sitesi (Vercel):** [https://tablo-timelinecalender.vercel.app](https://tablo-timelinecalender.vercel.app)
- 📦 **GitHub Deposu:** [https://github.com/ikg001/tablo-timelinecalender](https://github.com/ikg001/tablo-timelinecalender)
