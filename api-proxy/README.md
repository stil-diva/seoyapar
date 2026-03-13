# SEOYapar - DataForSEO API Proxy

Bu Cloudflare Worker, DataForSEO API'ye güvenli proxy görevi görür.
API credentials'larınız sunucuda kalır, frontend'e hiçbir zaman açılmaz.

## 🚀 Kurulum

### 1. DataForSEO Hesap Açın

1. [app.dataforseo.com/register](https://app.dataforseo.com/register) adresine gidin
2. E-posta ve şifre ile ücretsiz hesap oluşturun (kredi kartı gerekmez!)
3. **$1 ücretsiz kredi** otomatik yüklenir
4. **Dashboard → API Access** bölümünden login ve password'ünüzü kopyalayın

### 2. Cloudflare Worker Deploy

```bash
# Wrangler CLI yükle (zaten yoksa)
npm install -g wrangler

# Cloudflare'a giriş yap
wrangler login

# API credentials'ları ekle
wrangler secret put DATAFORSEO_LOGIN
wrangler secret put DATAFORSEO_PASSWORD

# Deploy et
wrangler deploy
```

### 3. SEOYapar'da Bağlan

1. seoyapar.com → Sağ üstteki ⚙️ (dişli) ikonuna tıklayın
2. Worker URL'nizi girin: `https://seoyapar-keyword-proxy.YOUR_ACCOUNT.workers.dev`
3. "Bağlantıyı Test Et" butonuna tıklayın
4. ✅ gördüyseniz "Kaydet" butonuna basın

## 💰 Maliyet

| Bileşen | Maliyet |
|---------|---------|
| DataForSEO Kayıt | **Ücretsiz** ($1 başlangıç kredisi) |
| Keyword Hacim Sorgusu | $0.01 / istek (1000 keyword'e kadar) |
| SERP Analizi | $0.002 / istek ($50 bakiye gerektirir) |
| Cloudflare Worker | Ücretsiz (100K istek/gün) |
| **Sonraki yükleme** | **Min. $50** (kullandıkça öde) |

> 💡 $1 başlangıç kredisi ile: ~100 keyword hacim isteği = ~100.000 keyword analizi yapılabilir.
> $50 yükleme ile: keyword hacim + SERP rakip analizi + keyword fikirleri — tamamı aktif olur.

## 📊 Ne Sağlar?

### Keyword Hacim Verisi ($0.01/istek — $1 kredi ile çalışır)
- ✅ Gerçek aylık arama hacmi (Google Keyword Planner verisi)
- ✅ Rekabet düzeyi (LOW/MEDIUM/HIGH)
- ✅ CPC (tıklama başına maliyet) — TL cinsinden
- ✅ Son 24 ay trend verisi
- ✅ Türkiye'ye özel veriler

### Google SERP Rakip Analizi ($0.002/istek — $50+ bakiye gerektirir)
- 🔍 Kategorideki Google sıralaması
- 🏢 Trendyol/Hepsiburada'daki rakip mağazalar
- ⚡ Rakiplerin kullandığı eksik kelimeler

## ⚙️ Teknik Detaylar

- **Keyword Volume**: `POST /v3/keywords_data/google_ads/search_volume/live`
- **SERP Results**: `POST /v3/serp/google/organic/live/regular`
- **Max batch**: 1000 keyword/istek (volume), 1 query/istek (SERP)
- **Ülke**: 2792 (Türkiye) — Dil: `tr`
- **Auth**: Basic Auth (login:password)
