import { timingSafeEqual, createHash } from "node:crypto";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { validPushEndpoint } from "@/lib/pwa/push";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const secret = process.env.REMINDER_CRON_SECRET,
    header = request.headers.get("authorization") ?? "";
  if (
    !secret ||
    secret.length < 32 ||
    !timingSafeEqual(
      createHash("sha256").update(header).digest(),
      createHash("sha256")
        .update("Bearer " + secret)
        .digest(),
    )
  )
    return Response.json(
      { message: "Yetkili zamanlayıcı erişimi gerekiyor." },
      { status: 401 },
    );
  const hour = Number(
    new Intl.DateTimeFormat("en", {
      timeZone: "Europe/Istanbul",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );
  if (hour !== 18)
    return Response.json({
      accepted: 0,
      message:
        "Hatırlatmalar Türkiye saatiyle 18.00–18.59 arasında gönderilir.",
    });
  const url = process.env.SUPABASE_URL,
    key =
      process.env.SUPABASE_SERVER_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    publicKey = process.env.WEB_PUSH_PUBLIC_KEY,
    privateKey = process.env.WEB_PUSH_PRIVATE_KEY,
    subject = process.env.WEB_PUSH_CONTACT;
  if (!url || !key || !publicKey || !privateKey || !subject)
    return Response.json(
      { message: "Bildirim sunucusu kurulumu eksik." },
      { status: 503 },
    );
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const rows = await db.rpc("claim_push_batch");
    if (rows.error) throw Error("storage");
    let accepted = 0,
      failed = 0;
    const batch = rows.data ?? [];
    for (let offset = 0; offset < batch.length; offset += 5)
      await Promise.all(
        batch
          .slice(offset, offset + 5)
          .map(
            async (row: {
              endpoint: string;
              p256dh: string;
              auth: string;
              user_id: string;
            }) => {
              if (!validPushEndpoint(row.endpoint)) {
                failed++;
                return;
              }
              try {
                await webpush.sendNotification(
                  {
                    endpoint: row.endpoint,
                    keys: { p256dh: row.p256dh, auth: row.auth },
                  },
                  "{}",
                  { TTL: 3600, timeout: 15000 },
                );
                accepted++;
              } catch (e) {
                failed++;
                const code = (e as { statusCode?: number }).statusCode;
                if (code === 404 || code === 410)
                  await db
                    .from("push_subscriptions")
                    .delete()
                    .eq("endpoint", row.endpoint)
                    .eq("user_id", row.user_id);
              }
            },
          ),
      );
    return Response.json(
      { accepted, failed },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { message: "Bildirimler gönderilemedi; özel veriler loglanmadı." },
      { status: 503 },
    );
  }
}
