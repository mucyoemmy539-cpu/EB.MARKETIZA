```javascript
import { supabase, supabaseReady } from "./supabaseClient.js";

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchProducts");

let products = [];

function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function render(items) {
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = '<div class="empty">No products found.</div>';
    return;
  }

  grid.innerHTML = items.map(p => `
    <article class="product-card">
      ${p.image_url ? `
        <img 
          src="${escapeHtml(p.image_url)}" 
          alt="${escapeHtml(p.name)}"
          loading="lazy"
        >
      ` : ""}

      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>

        <p>${escapeHtml(p.description || "")}</p>

        <strong>${Number(p.price).toFixed(2)} SEK</strong>

        <small>
          ${p.stock > 0
            ? `In stock: ${p.stock}`
            : "Out of stock"}
        </small>
      </div>
    </article>
  `).join("");
}

async function load() {
  if (!supabaseReady) {
    if (grid) {
      grid.innerHTML = `
        <div class="empty">
          Connect Supabase to load the real product database.
        </div>
      `;
    }
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (grid) {
      grid.innerHTML = `
        <div class="empty">
          ${escapeHtml(error.message)}
        </div>
      `;
    }
    return;
  }

  products = data || [];
  render(products);
}

search?.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();

  render(
    products.filter(p =>
      String(p.name || "").toLowerCase().includes(q) ||
      String(p.description || "").toLowerCase().includes(q)
    )
  );
});

load();
```
