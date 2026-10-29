import {
  DEFAULT_GEMINI_MODEL,
  verifyGeminiModel,
} from "../src/lib/lumi/gemini.ts";
const key = process.env.GEMINI_API_KEY?.trim();
const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
if (!key) {
  console.error(
    "GEMINI_API_KEY eksik. Sunucu ortamını veya .env.local dosyasını ayarlayın.",
  );
  process.exitCode = 1;
} else {
  try {
    await verifyGeminiModel(key, model);
    console.log(`Model erişilebilir ve metin üretimini destekliyor: ${model}`);
  } catch (error) {
    console.error(
      `Model doğrulanamadı (${error instanceof Error ? error.message : "PROVIDER_UNAVAILABLE"}). Anahtarı, model kimliğini, kotayı ve bağlantıyı kontrol edin.`,
    );
    process.exitCode = 1;
  }
}
