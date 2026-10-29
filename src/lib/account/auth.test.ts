import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { accountError } from "./errors.ts";
test("Auth failures explain SMTP, quotas and setup without disclosing raw provider data", () => {
  for (const [code, expected] of [
    ["email_address_not_authorized", /SMTP/],
    ["over_email_send_rate_limit", /sınırına/],
    ["signup_disabled", /kaydı kapalı/],
    ["email_provider_disabled", /giriş kapalı/],
    ["captcha_failed", /CAPTCHA/],
    ["weak_password", /güvenlik kurallarını/],
    ["unexpected_failure", /Auth günlüklerindeki/],
  ] as const) {
    const result = accountError({
      code,
      status: 500,
      message: "private@example.invalid SECRET_TOKEN",
    });
    assert.match(result, expected);
    assert.doesNotMatch(result, /private@example|SECRET_TOKEN/);
  }
  assert.match(
    accountError({ message: "Error sending confirmation email" }),
    /SMTP/,
  );
  assert.match(
    accountError({ message: "Database error saving new user" }),
    /veritabanına/,
  );
  assert.match(
    accountError({
      message: "private@example.invalid SECRET_TOKEN",
      code: "future_auth_error",
      status: 422,
    }),
    /future_auth_error.*HTTP: 422/,
  );
  assert.doesNotMatch(
    accountError({
      message: "SECRET_TOKEN",
      code: "<script>SECRET_TOKEN</script>",
    }),
    /SECRET_TOKEN/,
  );
});
/** Contract tests use a fake transport; no real account or email is created. */
test("Official Auth SDK: verification, login, persistent session, reset redirect, logout and friendly errors", async () => {
  const memory = new Map<string, string>(),
    requests: {
      path: string;
      method: string;
      body: Record<string, unknown>;
    }[] = [];
  const user = {
    id: "11111111-1111-4111-8111-111111111111",
    aud: "authenticated",
    email: "test@example.invalid",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  };
  const token = {
    access_token:
      "test." +
      Buffer.from(
        JSON.stringify({
          exp: Math.floor(Date.now() / 1000) + 3600,
          sub: user.id,
        }),
      ).toString("base64url") +
      ".test",
    refresh_token: "test-refresh",
    token_type: "bearer",
    expires_in: 3600,
    user,
  };
  const storage = {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => {
      memory.set(k, v);
    },
    removeItem: (k: string) => {
      memory.delete(k);
    },
  };
  const transport: typeof fetch = async (input, init) => {
    const url = new URL(String(input)),
      path = url.pathname,
      method = init?.method ?? "GET",
      body = init?.body ? JSON.parse(String(init.body)) : {};
    requests.push({ path: path + url.search, method, body });
    if (path.endsWith("/signup")) return Response.json(user);
    if (path.endsWith("/token") && body.grant_type !== "refresh_token") {
      if (body.password === "wrong")
        return Response.json(
          { msg: "Invalid login credentials", code: "invalid_credentials" },
          { status: 400 },
        );
      return Response.json(token);
    }
    if (path.endsWith("/user")) return Response.json(user);
    if (path.endsWith("/recover")) return Response.json({});
    if (path.endsWith("/logout")) return new Response(null, { status: 204 });
    throw new Error("Unexpected mock Auth request: " + path);
  };
  const make = () =>
    createClient("https://test.example.invalid", "public-test-key", {
      auth: {
        storage,
        storageKey: "account-test",
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
      global: { fetch: transport },
    });
  const first = make();
  const registration = await first.auth.signUp({
    email: user.email,
    password: "test-password-only",
    options: {
      emailRedirectTo: "https://garden.example.invalid/hesap/dogrula",
    },
  });
  assert.equal(registration.error, null);
  assert.equal(registration.data.session, null);
  const failed = await first.auth.signInWithPassword({
    email: user.email,
    password: "wrong",
  });
  assert.ok(failed.error);
  const login = await first.auth.signInWithPassword({
    email: user.email,
    password: "test-password-only",
  });
  assert.equal(login.error, null);
  assert.equal(login.data.user?.id, user.id);
  const second = make();
  assert.equal((await second.auth.getSession()).data.session?.user.id, user.id);
  assert.equal((await second.auth.getUser()).data.user?.id, user.id);
  const reset = await second.auth.resetPasswordForEmail(user.email, {
    redirectTo: "https://garden.example.invalid/hesap/sifre-guncelle",
  });
  assert.equal(reset.error, null);
  assert.ok(
    requests.some((r) =>
      r.path.includes(
        "recover?redirect_to=https%3A%2F%2Fgarden.example.invalid%2Fhesap%2Fsifre-guncelle",
      ),
    ),
  );
  assert.equal((await second.auth.signOut({ scope: "local" })).error, null);
  const third = make();
  assert.equal((await third.auth.getSession()).data.session, null);
  await first.auth.dispose();
  await second.auth.dispose();
  await third.auth.dispose();
});
