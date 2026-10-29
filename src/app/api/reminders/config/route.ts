export const dynamic = "force-dynamic";
export function GET() {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY?.trim();
  return Response.json(
    {
      configured: !!(
        publicKey &&
        process.env.WEB_PUSH_PRIVATE_KEY &&
        process.env.REMINDER_CRON_SECRET &&
        process.env.REMINDER_CRON_SECRET.length >= 32 &&
        process.env.WEB_PUSH_CONTACT &&
        process.env.SUPABASE_URL &&
        (process.env.SUPABASE_SERVER_SECRET_KEY ||
          process.env.SUPABASE_SERVICE_ROLE_KEY)
      ),
      publicKey: publicKey ?? null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
