# Ev Hizmetleri Platformu Deployment Kılavuzu

Bu belge, Ev Hizmetleri Platformu'nu tamamen ücretsiz araçlar kullanarak canlıya alma sürecini adım adım açıklar.

## Ön Gereksinimler

1. [GitHub](https://github.com) hesabı: https://github.com/ahmetguner74/ev-servis.git
2. [Vercel](https://vercel.com) hesabı (ücretsiz plan) : 
3. [EmailJS](https://www.emailjs.com) hesabı (ücretsiz plan - aylık 200 e-posta)

## EmailJS Kurulumu

1. [EmailJS](https://www.emailjs.com) sitesine gidin ve ücretsiz bir hesap oluşturun.
2. Giriş yaptıktan sonra "Email Services" bölümünden "Add New Service" seçeneğini tıklayın.
3. Gmail, Outlook veya diğer bir e-posta servis sağlayıcınızı seçin ve bağlantıyı tamamlayın.
4. Servis oluşturulduktan sonra, servis ID'nizi not edin (ör. `service_x1y2z3`).
5. "Email Templates" bölümüne gidin ve "Create New Template" tıklayın.
6. Şablonunuzu aşağıdaki gibi oluşturun:
   - **To Email**: {{to_email}} (ahmetguner74@gmail.com olarak sabit de tanımlayabilirsiniz)
   - **From Name**: {{from_name}}
   - **From Email**: {{from_email}}
   - **Subject**: {{subject}}
   - **Message**:
     ```
     Müşteri İletişim: {{from_phone}}
     
     {{message}}
     ```
7. Şablonu kaydedin ve template ID'nizi not edin (ör. `template_a1b2c3`).
8. "Account" bölümüne gidin ve "API Keys" sekmesinden public key'inizi not edin (ör. `user_d1e2f3`).

## NextAuth Yapılandırması

NextAuth.js, uygulamada kimlik doğrulama işlemlerini yönetmek için kullanılmaktadır. Doğru yapılandırma için şu adımları izleyin:

1. Güçlü bir `NEXTAUTH_SECRET` değeri oluşturun. Terminal'de şu komutu kullanabilirsiniz:
   ```
   openssl rand -base64 32
   ```
   Bu komut size rastgele bir güvenlik anahtarı oluşturacaktır.

2. `NEXTAUTH_URL` değişkeni için projenizin tam URL'sini belirleyin:
   - Geliştirme ortamı için: `http://localhost:3000`
   - Üretim ortamı için: `https://ev-servis-yeni.vercel.app` (Vercel'deki gerçek domain adınız)

3. Vercel'de bu değişkenleri proje ayarlarınızın "Environment Variables" bölümünde tanımlayın.

4. Prisma ile veritabanı bağlantısı için `DATABASE_URL` değişkenini doğru şekilde yapılandırın.

## Vercel ile Deployment

1. Projenizi bir GitHub repository'sine yükleyin.
2. [Vercel](https://vercel.com) hesabınıza giriş yapın.
3. "New Project" butonuna tıklayın.
4. GitHub hesabınızı bağlayın ve projenizin repository'sini seçin.
5. "Configure Project" aşamasında, "Environment Variables" bölümüne aşağıdaki değişkenleri ekleyin:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: EmailJS'den aldığınız service ID
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: EmailJS'den aldığınız template ID
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`: EmailJS'den aldığınız public key
   - `NEXT_PUBLIC_EMAILJS_TO_EMAIL`: EmailJS'nin gönderileceği e-posta adresi
   - `DATABASE_URL`: Veritabanı bağlantı URL'si (Örn: PostgreSQL için `postgresql://user:password@host:port/database`)
   - `NEXTAUTH_SECRET`: Güçlü bir rastgele dize (örn: `openssl rand -base64 32` komutu ile oluşturabilirsiniz)
   - `NEXTAUTH_URL`: Projenizin yayınlandığı URL (ör. `https://ev-servis-yeni.vercel.app`)
6. "Deploy" butonuna tıklayın ve deployment işleminin tamamlanmasını bekleyin.
7. Deployment tamamlandığında, Vercel size bir URL verecektir.

## Vercel'de Auth Sorunu Çözümü

Eğer Vercel'de auth ile ilgili sorunlar yaşıyorsanız, şu adımları izleyin:

1. Vercel projesi ayarlarında "Environment Variables" bölümüne gidin ve şu değişkenlerin doğru şekilde ayarlandığından emin olun:
   - `NEXTAUTH_SECRET` - Güçlü bir güvenlik anahtarı
   - `NEXTAUTH_URL` - Vercel'de yayınlanan tam projenizin URL'si
   - `DATABASE_URL` - Geçerli bir veritabanı URL'si

2. Vercel projesi ayarlarında "Deployments" sekmesinden en son deployment'ı seçin ve "Redeploy" yapın.

3. Eğer yeni bir veritabanı kullanıyorsanız, ilk kullanımda şema oluşturulması için:
   ```
   npx prisma db push
   ```
   komutunu kullanabilirsiniz.

4. Sorunun devam etmesi durumunda Vercel loglarını kontrol edin.

## Deployment Sonrası Kontroller

1. Projenin başarıyla deploy edildiğini doğrulamak için Vercel'in verdiği URL'i ziyaret edin.
2. Giriş/Kayıt işlemlerinin düzgün çalıştığını test edin.
3. Form gönderiminin düzgün çalıştığını test edin.
4. E-posta bildirimlerinin geldiğini kontrol edin.
5. WhatsApp bağlantısının düzgün çalıştığını kontrol edin.

## Özelleştirme

1. Kendi alan adınızı eklemek için Vercel dashboard'unda "Settings" > "Domains" bölümüne gidin.
2. Alan adınızı ekleyin ve Vercel'in sunduğu DNS kayıtlarını alan adı sağlayıcınızın kontrol panelinde ayarlayın.

## Sınırlamalar ve Ücretsiz Plan İpuçları

1. **EmailJS sınırlaması**: Ücretsiz planda aylık 200 e-posta gönderebilirsiniz. Daha fazlasına ihtiyacınız varsa, ücretli plana yükseltmeniz gerekebilir.
2. **Vercel sınırlamaları**: 
   - Serverless fonksiyonları için çalışma süresi sınırı: 10 saniye
   - Bant genişliği: Sınırsız (adil kullanım politikasına tabi)
   - Build süresi: Ayda 6000 dakika (bu çoğu küçük-orta ölçekli proje için yeterlidir)
3. **Veritabanı**: SQLite, üretim ortamları için en uygun seçenek değildir. Daha sonra PlanetScale (MySQL), Supabase veya Neon (PostgreSQL) gibi ücretsiz tier'a sahip bulut veritabanlarına geçiş yapabilirsiniz.

## Sorun Giderme

- **Auth sorunları**: NEXTAUTH_SECRET ve NEXTAUTH_URL değişkenlerinin doğru ayarlandığından emin olun.
- **Veritabanı hataları**: DATABASE_URL'in doğru olduğunu ve veritabanı şemasının oluşturulduğunu doğrulayın.
- **E-postalar gelmiyor**: EmailJS ayarlarınızı kontrol edin ve günlük e-posta limitinizi aşmadığınızdan emin olun.
- **WhatsApp bildirimi çalışmıyor**: WhatsApp API doğrudan kullanılmadığı için, bağlantı URL formatının doğru olduğundan emin olun.
- **Deployment hataları**: Vercel'in build ve deployment loglarını kontrol edin.

## Sonraki Adımlar

1. Google Analytics ekleyerek kullanıcı davranışlarını izleyin.
2. Gerçek bir veritabanı hizmeti kullanarak verileri depolamaya başlayın.
3. Otomatik testler ekleyerek kod kalitesini artırın.
4. Daha kapsamlı e-posta şablonları oluşturun.
5. WhatsApp Business API'ye geçiş için hazırlık yapın.

NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_iqjzqzf"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_6sbkdsj"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="Kv-_z4bKhVQV15bsX"

## Supabase Kurulumu ve Yapılandırması

Projemiz artık Supabase'in yeteneklerini kullanacak şekilde yapılandırılmıştır. Supabase kurulumu için aşağıdaki adımları izleyin:

1. [Supabase](https://supabase.com/) üzerinde ücretsiz bir hesap oluşturun.
2. Yeni bir proje oluşturun ve şunları not edin:
   - Proje URL'si
   - API Anahtarları (anon ve service_role)

3. Supabase SQL editörüne gidin ve `supabase/migrations/20231228000000_initial_schema.sql` dosyasındaki SQL kodunu çalıştırın.

4. Auth sağlayıcılarını yapılandırın:
   - Authentication > Providers bölümüne gidin
   - Email/Password ayarlarını kontrol edin
   - Google, GitHub veya başka OAuth sağlayıcıları için gerekli ayarları yapın
   - Redirect URL'leri `https://your-domain.com/auth/callback` şeklinde ayarlayın

5. Depolama yapılandırması:
   - Storage > New Bucket seçeneğine tıklayın
   - "service-images" adında bir bucket oluşturun
   - İzinleri yapılandırın (public/private)

6. Şu .env değişkenlerini ayarlayın:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres
   ```

7. Vercel'i bu değişkenlerle güncelleyin.

## Supabase ile Kullanılabilir Özellikler

Supabase entegrasyonu sayesinde artık uygulamamızda şu özellikler kullanılabilir:

1. **Kimlik Doğrulama**:
   - Email/Şifre ile giriş
   - Sosyal medya hesaplarıyla giriş (Google, GitHub)
   - Şifremi unuttum akışı
   - Kullanıcı profil yönetimi

2. **Veritabanı İşlemleri**:
   - Hizmet listeleme/oluşturma/güncelleme/silme
   - Kullanıcı profilleri
   - Randevu oluşturma ve takibi
   - Hizmet derecelendirme ve yorumları

3. **Dosya Depolama**:
   - Hizmet resimlerini yükleme
   - Profil fotoğrafları 
   - Kullanıcı belgelerini depolama

4. **Gerçek Zamanlı Güncellemeler**:
   - Sohbet sistemi
   - Bildirimler
   - Anlık randevu güncellemeleri 