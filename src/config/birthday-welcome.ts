import type { WelcomeConfiguration } from "../lib/birthday/welcome-model.ts";

/** Yalnızca sunucu okur. Kişiselleştirmek için uygulama mantığını değiştirmeyin. */
export const birthdayWelcome: WelcomeConfiguration = {
  enabled: false,
  recipientName: "",
  senderSignature: "",
  message: `İyi ki doğdun! 🌷

Senin için küçük ama rengârenk bir dünya hazırladım.

Burada öğrendiğin her yeni Almanca kelime, bahçende açan yeni bir çiçek olsun.

Umarım bu bahçe sana öğrenmenin ne kadar güzel olabileceğini hatırlatır.

Alles Gute zum Geburtstag! 💜`,
};
