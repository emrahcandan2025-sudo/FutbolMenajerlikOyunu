# CNDN Football Manager — Android APK kaynak projesi

Bu depo, Expo + React Native ile hazırlanmış Türkçe futbol menajerliği prototipini ve GitHub Actions üzerinden Android APK derleme iş akışını içerir. **Kaynak kod deposu APK'nın kendisi değildir.**

## GitHub Actions ile APK oluşturma (telefon üzerinden)

### 1) Depoyu oluştur
1. Android telefonunda tarayıcıdan https://github.com/new adresini aç ve GitHub hesabına giriş yap.
2. Repository name alanına `cndn-football-manager` yaz.
3. Ücretsiz derleme için **Public** seçebilirsin. Dikkat: Public depoda kaynak kodların herkes tarafından görülebilir. Kodların özel kalmasını istiyorsan Private seç; bu durumda GitHub Free planındaki aylık Actions dakikası sınırları geçerlidir.
4. README, .gitignore veya lisans dosyasını GitHub'da ayrıca oluşturma; bu projede zaten var. `Create repository` ile boş depoyu oluştur.

### 2) ZIP içeriğini depoya yükle
1. Bu projenin ZIP dosyasını telefonuna indir ve dosya yöneticisinde aç/çıkar.
2. Çıkan `FutbolMenajerlikOyunu` klasörünün **içindeki tüm dosya ve klasörleri** depoya yükle. `App.js`, `app.json`, `package.json`, `src/`, `.github/` ve `.gitignore` dosyaları deponun en üst seviyesinde görünmelidir.
3. GitHub web arayüzünde depoda `Add file` → `Upload files` seçeneğiyle dosyaları yükleyebilirsin. Mobil arayüz dosya/klasör yüklemeyi zorlaştırırsa tarayıcı menüsünden **Masaüstü sitesi** seçeneğini aç.
4. Yükleme sayfasında `.github/workflows/android-apk.yml` dosyasının da yüklendiğini doğrula. Dosyalar depoda yoksa Actions iş akışı çalışmaz.
5. `Commit changes` ile kaydet.

### 3) Derlemeyi başlat
1. Depoda `Actions` sekmesine gir.
2. Solda `CNDN Football Manager - Android APK` iş akışını seç.
3. `Run workflow` düğmesine bas, dal olarak `main` (yoksa `master`) seç ve tekrar `Run workflow` de.
4. Çalışan derleme satırına dokun. Yeşil tik başarı, kırmızı çarpı hata anlamına gelir. İlk derleme birkaç dakika sürebilir.

### 4) APK'yı indirip kur
1. Başarılı iş akışı çalıştırmasını aç.
2. Sayfanın altındaki `Artifacts` bölümünden `cndn-football-manager-apk` öğesine dokun.
3. İnen ZIP dosyasını telefonunda aç; içindeki `.apk` dosyasını bul.
4. APK'ya dokun. Android isterse tarayıcı/dosya yöneticisi için `Bu kaynaktan yüklemeye izin ver` iznini yalnızca bu kurulum için etkinleştir.
5. APK'yı kurup aç. Tanımadığın başka APK'ları yükleme.

## Ücretsiz kullanım

GitHub Actions, standart GitHub-hosted runner'larda **public depolar için ücretsizdir**. Private depolarda planın aylık ücretsiz dakika ve depolama kotaları geçerlidir; kota aşılırsa ek ücret oluşabilir veya kullanım durdurulabilir. Ücret çıkmasını istemiyorsan GitHub hesabındaki `Settings → Billing and licensing` bölümünden Actions kullanımı/bütçesini kontrol et. Büyük runner kullanma.

## İş akışı ne yapıyor?

`.github/workflows/android-apk.yml` şunları otomatik yapar:
- Node.js 20 ve Java 17 kurar.
- npm paketlerini yükler.
- Expo'nun Android yerel projesini üretir.
- Android release APK derler.
- APK'yı 14 gün saklanan `cndn-football-manager-apk` artifact'i olarak sunar.

İş akışı `main` veya `master` dalına commit atıldığında da çalışır. Elle başlatmak için `Actions → CNDN Football Manager - Android APK → Run workflow` yolunu kullan.

## Sorun giderme

- **Actions sekmesi görünmüyor:** Depo `Settings → Actions → General` bölümünde Actions kullanımına izin verildiğini kontrol et.
- **Workflow listede yok:** `.github/workflows/android-apk.yml` yolunu ve dosyanın `main`/`master` dalına commit edildiğini kontrol et.
- **Build başarısız:** Çalıştırmayı açıp kırmızı hata adımının loglarını incele. Hata metnini paylaşırken token, parola veya gizli anahtar paylaşma.
- **Artifact yok:** Derleme adımı başarısız olmuş olabilir; loglarda `Build release APK` ve `Upload APK artifact` adımlarını kontrol et.
- **Uygulama kurulmuyor:** Önceki sürüm farklı imzayla kuruluysa onu kaldırıp tekrar dene. Kaldırmak cihazdaki yerel kariyer kayıtlarını silebilir.

## Projenin kapsamı

Bu hâlâ geliştirilmekte olan bir prototiptir; tam kapsamlı ticari bir futbol menajerliği oyunu değildir. Oyuncu/kulüp verilerinin çoğu örnektir. Gerçek takım ve futbolcu adları, armalar ve lig verileri için uygun lisanslar gerekebilir. APK üretmek eksik oyun özelliklerini otomatik olarak tamamlamaz.
