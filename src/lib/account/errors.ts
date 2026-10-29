export function accountError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : String(error);
  if (/REWARD_ALREADY_CLAIMED/.test(message))
    return "Bu hediye hesabında daha önce alınmış. Cihaz kaydın korundu; bulut kaydını yükleyip tekrar kontrol et. Kayıtları birleştirme veya hediyeyi yeniden alma işlemi yapılmadı.";
  const record =
    error && typeof error === "object"
      ? (error as Record<string, unknown>)
      : {};
  const code = typeof record.code === "string" ? record.code : "";
  // Provider codes identify the failure without exposing raw messages, addresses or tokens.
  const authMessages: Record<string, string> = {
    email_address_not_authorized:
      "Supabase bu adrese doğrulama e-postası gönderemiyor. Varsayılan e-posta hizmeti yalnızca Supabase kuruluşundaki ekip üyelerine gönderir. Diğer adresler için özel SMTP kurulmalı.",
    over_email_send_rate_limit:
      "Supabase doğrulama e-postası gönderme sınırına ulaştı. Art arda deneme yapma; bir süre sonra yeniden dene veya e-posta gönderim ayarlarını kontrol et.",
    over_request_rate_limit:
      "Çok fazla hesap isteği gönderildi. Biraz bekleyip yeniden dene.",
    signup_disabled:
      "Supabase projesinde yeni hesap kaydı kapalı. Authentication ayarlarından kayıt izni açılmalı.",
    email_provider_disabled:
      "Supabase projesinde e-posta ile giriş kapalı. Authentication → Sign In / Providers bölümündeki Email ayarı kontrol edilmeli.",
    email_address_invalid:
      "E-posta adresinin biçimini kontrol et. Supabase bu adresi kabul etmedi.",
    invalid_credentials: "E-posta veya parola hatalı.",
    user_already_exists:
      "Bu e-posta için giriş yapmayı veya parola sıfırlamayı deneyebilirsin.",
    email_exists:
      "Bu e-posta için giriş yapmayı veya parola sıfırlamayı deneyebilirsin.",
    email_not_confirmed:
      "Önce e-posta adresini doğrulaman gerekiyor. Gelen kutunu ve istenmeyen postaları kontrol et.",
    weak_password:
      "Parolan Supabase projesinin güvenlik kurallarını karşılamıyor. En az 10 karakter ve projenin istediği karakter türlerini kullan.",
    captcha_failed:
      "Supabase CAPTCHA doğrulaması istiyor ancak doğrulama tamamlanamadı. Projenin Attack Protection ayarı ve uygulamanın CAPTCHA bağlantısı kontrol edilmeli.",
    same_password: "Yeni parolan önceki parolandan farklı olmalı.",
    flow_state_expired:
      "Doğrulama bağlantısının süresi dolmuş. Yeni bağlantı isteyip aynı tarayıcıda aç.",
    bad_code_verifier:
      "Doğrulama bağlantısı bu tarayıcıdaki istekle eşleşmedi. Bağlantıyı isteği başlattığın tarayıcıda aç.",
  };
  if (Object.hasOwn(authMessages, code)) return authMessages[code];
  if (/Database error saving new user/i.test(message))
    return "Supabase kullanıcı kaydını veritabanına yazamadı. Projenin Auth günlüklerindeki kayıt hatası kontrol edilmeli. Mevcut ilerlemen değiştirilmedi.";
  if (/Error sending (confirmation|recovery|magic link) email/i.test(message))
    return "Supabase doğrulama veya parola yenileme e-postasını gönderemedi. SMTP ayarları ve Auth günlüklerindeki gönderim hatası kontrol edilmeli.";
  if (code === "unexpected_failure")
    return "Supabase hesap hizmeti isteği tamamlayamadı (hata kodu: unexpected_failure). Kesin neden için Supabase Auth günlüklerindeki son başarısız isteği kontrol et.";
  const safeCode = /^[a-z][a-z0-9_]{0,63}$/.test(code);
  if (safeCode) return genericAccountError(record, code);
  if (/PRIVACY_CONFLICT/i.test(message))
    return "Başka bir cihazda sohbet geçmişin silinmiş. Eski içeriklerin geri yüklenmesini önlemek için önce bulut kaydını yükle. Cihaz kaydın yedekte korunur.";
  if (/SYNC_CONFLICT|OPERATION_MISMATCH/i.test(message))
    return "Başka bir cihazda daha yeni kayıt var. Eşitleme seçeneklerinden korunacak kaydı seç.";
  if (/ALREADY_IMPORTED/i.test(message))
    return "Bu yerel kayıt daha önce aktarıldı. Ödül ve satın almalar yeniden eklenmedi.";
  if (/ACHIEVEMENT_ALREADY_CLAIMED/i.test(message))
    return "Bu rozetin bahçe ödülü hesabında daha önce alınmış. Yeniden ödül verilmedi. Profilindeki eşitleme seçeneklerinden bulut kaydını yükleyebilirsin; cihaz yedeğin korunur.";
  if (/INVALID_ACHIEVEMENT|INVALID_XP_EVIDENCE|DAILY_XP_LIMIT/i.test(message))
    return "Sunucu başarı veya XP kaydını doğrulayamadı. Eşitleme durduruldu; yerel kaydın korunuyor. Profilinden bulut kaydını yükleyebilir veya kayıtları dışa aktarabilirsin.";
  if (/Invalid login credentials/i.test(message))
    return "E-posta veya parola hatalı.";
  if (/Email not confirmed/i.test(message))
    return "Önce e-posta adresini doğrulaman gerekiyor. Gelen kutunu ve istenmeyen postaları kontrol et.";
  if (/already registered|already been registered/i.test(message))
    return "Bu e-posta için giriş yapmayı veya parola sıfırlamayı deneyebilirsin.";
  if (/rate limit|too many|429/i.test(message))
    return "Çok fazla deneme yapıldı. Biraz bekleyip yeniden dene.";
  if (/password|weak_password/i.test(message))
    return "Parolan en az 10 karakter olmalı ve hesabın parola kurallarını karşılamalı.";
  if (/fetch|network|timeout|offline|connection/i.test(message))
    return "Bulut bağlantısı kurulamadı. Cihazındaki kayıt korundu; bağlantını kontrol edip yeniden dene.";
  if (/schema cache|does not exist|PGRST|permission denied/i.test(message))
    return "Supabase veritabanı kurulumu eksik veya erişim politikası uygun değil. Hesap kurulum belgesindeki SQL geçişlerini kontrol et.";
  if (/token|session|AUTH_REQUIRED/i.test(message))
    return "Oturum doğrulanamadı. Yeniden giriş yap.";
  return genericAccountError(record, code);
}
function genericAccountError(record: Record<string, unknown>, code: string) {
  const diagnostic = /^[a-z][a-z0-9_]{0,63}$/.test(code)
    ? ` Hata kodu: ${code}.`
    : "";
  const status =
    typeof record.status === "number" &&
    Number.isInteger(record.status) &&
    record.status >= 400 &&
    record.status <= 599
      ? ` HTTP: ${record.status}.`
      : "";
  return (
    "Hesap işlemi tamamlanamadı. Kayıtların korunuyor." +
    diagnostic +
    status +
    " Supabase Auth günlüklerindeki son başarısız isteği kontrol et."
  );
}
