export type PublicAccountConfig = {
  configured: boolean;
  url?: string;
  key?: string;
  deletionConfigured?: boolean;
};
/** Only publishable/legacy anon keys may cross the server/browser boundary. */
export function accountConfig(
  env: Record<string, string | undefined>,
): PublicAccountConfig {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { configured: false };
  let safeKey = key.startsWith("sb_publishable_");
  if (!safeKey) {
    try {
      safeKey =
        JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString())
          .role === "anon";
    } catch {
      safeKey = false;
    }
  }
  try {
    const parsed = new URL(url);
    if (
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      parsed.pathname !== "/" ||
      (parsed.protocol !== "https:" &&
        !(
          env.NODE_ENV !== "production" &&
          ["localhost", "127.0.0.1"].includes(parsed.hostname)
        ))
    )
      return { configured: false };
  } catch {
    return { configured: false };
  }
  return safeKey
    ? {
        configured: true,
        url: new URL(url).origin,
        key,
        deletionConfigured: !!env.SUPABASE_SERVICE_ROLE_KEY,
      }
    : { configured: false };
}
