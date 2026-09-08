import { supabase, supabaseReady } from "./supabaseClient.js";

function msg(text, ok=false) {
  const el = document.getElementById("authMessage");
  if (el) {
    el.textContent = text;
    el.className = ok ? "message success" : "message error";
  } else {
    alert(text);
  }
}

function requireSupabase() {
  if (!supabaseReady) {
    msg("Supabase is not configured yet. Open config.js and add your Supabase URL and anon key.");
    return false;
  }
  return true;
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;
    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";
    const role = document.getElementById("role")?.value || "buyer";

    if (!fullName || !email || password.length < 6) {
      msg("Fill in all fields. Password must be at least 6 characters.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role } }
    });

    if (error) {
      msg(error.message);
      return;
    }

    if (data.session) {
      window.location.href = role === "seller" ? "seller-dashboard.html" : "index.html";
    } else {
      msg("Account created. Check your email to confirm the account, then log in.", true);
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;
    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      msg(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", data.user.id).maybeSingle();

    window.location.href = profile?.role === "seller" ? "seller-dashboard.html" : "index.html";
  });
}
