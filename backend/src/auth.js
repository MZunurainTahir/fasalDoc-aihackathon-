/**
 * Admin-backed signup that creates a confirmed Supabase user immediately.
 * This bypasses Supabase's email-confirmation requirement so users can log
 * in straight away, while still keeping real accounts in Supabase Auth.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function supabaseAdminFetch(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin credentials are not configured");
  }
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_ANON_KEY || "",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

export async function signUpUser({ email, password, fullName, phone, location, farmingType }) {
  const createRes = await supabaseAdminFetch("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text().catch(() => "");
    throw new Error(text || `Supabase admin signup failed (${createRes.status})`);
  }

  const user = await createRes.json();

  // Best-effort profile row creation. If it fails, auth still succeeded.
  try {
    const profileRes = await supabaseAdminFetch("/rest/v1/profiles", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: user.id,
        full_name: fullName || "",
        phone: phone || null,
        location: location || "",
        farming_type: farmingType || "both",
        preferred_language: "en",
      }),
    });
    if (!profileRes.ok) {
      const text = await profileRes.text().catch(() => "");
      console.warn("[signup] profile insert failed:", text);
    }
  } catch (err) {
    console.warn("[signup] profile insert error:", err.message);
  }

  return { user };
}
