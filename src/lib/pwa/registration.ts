/** Explicit push setup also works in secure loopback development. */
export async function ensurePushRegistration(
  container: Pick<
    ServiceWorkerContainer,
    "getRegistration" | "register" | "ready"
  >,
  timeoutMs = 15000,
): Promise<ServiceWorkerRegistration> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const registration =
      (await container.getRegistration("/")) ??
      (await container.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      }));
    if (registration.active) return registration;
    return await Promise.race([
      container.ready,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                "Bildirim hizmeti zamanında etkinleşmedi. Bağlantını kontrol edip yeniden dene.",
              ),
            ),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
