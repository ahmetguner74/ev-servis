# Ev Hizmetleri Platformu

Kullanıcıları çeşitli ev hizmetleri için hizmet sağlayıcılarla buluşturan kapsamlı bir web platformu.

## Özellikler

- Kullanıcı ve servis sağlayıcı kayıt/giriş sistemi (Email, Google)
- Hizmet kategorileri ve hizmet listeleme
- Randevu oluşturma ve takip etme
- Supabase ile güçlendirilmiş veritabanı ve kimlik doğrulama
- Gerçek zamanlı bildirimler ve sohbet
- Dosya depolama (servis ve profil resimleri)
- Responsive tasarım

## Teknolojiler

- Next.js 15.2.0
- React 19.0.0
- TypeScript
- Tailwind CSS
- Supabase (Veritabanı, Auth, Storage, Realtime)
- EmailJS

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/username/ev-servis-yeni.git
cd ev-servis-yeni
```

2. Gerekli paketleri yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını `.env.local` olarak kopyalayın ve gerekli bilgileri doldurun:
```bash
cp .env.example .env.local
```

4. Supabase'de yeni bir proje oluşturun ve gerekli bilgileri `.env.local` dosyasına ekleyin.

5. Supabase SQL editöründe `supabase/migrations/20231228000000_initial_schema.sql` dosyasındaki SQL kodunu çalıştırın.

6. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

7. Tarayıcınızda `http://localhost:3000` adresini açın.

## Deployment

Proje Vercel'e deploy edilmek üzere yapılandırılmıştır. Daha fazla bilgi için `DEPLOYMENT.md` dosyasına bakın.

## Lisans

MIT
