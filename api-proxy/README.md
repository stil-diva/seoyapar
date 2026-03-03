# SEOYapar - Google Keyword Planner API Proxy

Bu Cloudflare Worker, Google Ads Keyword Planner API'ye güvenli proxy görevi görür.
API anahtarlarınız sunucuda kalır, frontend'e hiçbir zaman açılmaz.

## 🚀 Kurulum

### 1. Google Ads API Erişimi Alın

1. [Google Ads Developer Token](https://developers.google.com/google-ads/api/docs/get-started/dev-token) başvurusu yapın
2. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
   - OAuth 2.0 Client ID oluşturun (Web Application)
   - Client ID ve Client Secret'ı not edin
3. Google Ads hesabınızdan Customer ID'yi alın (10 haneli numara)

### 2. OAuth2 Refresh Token Alın

```bash
# 1. Authorization URL'ye gidin (tarayıcıda açın):
https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline

# 2. Sayfada verilen "code" değerini alın

# 3. Refresh token alın:
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  -d "grant_type=authorization_code"

# Yanıttaki refresh_token'ı saklayın
```

### 3. Cloudflare Worker Deploy

```bash
# Wrangler CLI yükle
npm install -g wrangler

# Cloudflare'a giriş yap
wrangler login

# Secrets ekle (her biri için ayrı komut çalıştırın)
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GOOGLE_REFRESH_TOKEN
wrangler secret put GOOGLE_DEVELOPER_TOKEN
wrangler secret put GOOGLE_CUSTOMER_ID

# Deploy et
wrangler deploy
```

### 4. SEOYapar'da Bağlan

1. seoyapar.com → Sağ üstteki ⚙️ (dişli) ikonuna tıklayın
2. Worker URL'nizi girin: `https://seoyapar-keyword-proxy.YOUR_ACCOUNT.workers.dev`
3. "Bağlantıyı Test Et" butonuna tıklayın
4. ✅ gördüyseniz "Kaydet" butonuna basın

## 💰 Maliyet

| Bileşen | Maliyet |
|---------|---------|
| Google Ads API | Ücretsiz (hesap gerekli) |
| Cloudflare Worker | Ücretsiz (100K istek/gün) |
| **Toplam** | **$0/ay** |

## 📊 Ne Sağlar?

Google Keyword Planner verileri:
- ✅ Gerçek aylık arama hacmi (örn: "viskon elbise" → 8,100/ay)
- ✅ Rekabet düzeyi (LOW/MEDIUM/HIGH)
- ✅ CPC (tıklama başına maliyet)
- ✅ Son 12 ay trend verisi
- ✅ Türkiye'ye özel veriler (geo: TR, dil: TR)
