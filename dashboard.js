import { supabase, supabaseReady } from "./supabaseClient.js";

const list = document.getElementById("sellerProducts");
const form = document.getElementById("productForm");
const title = document.getElementById("productModalTitle");
const modal = document.getElementById("productModal");
const imageInput = document.getElementById("productImage");
let editingId = null;
let currentUser = null;

function message(text, ok=false) {
  const el = document.getElementById("dashboardMessage");
  if (el) {
    el.textContent = text;
    el.className = ok ? "message success" : "message error";
  } else alert(text);
}

async function start() {
  if (!supabaseReady) {
    message("Supabase is not configured. Add your URL and anon key in config.js.");
    return;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "seller") {
    window.location.href = "index.html";
    return;
  }
  await loadProducts();
}

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    message(error.message);
    return;
  }
  render(data || []);
}

function render(products) {
  if (!list) return;
  if (!products.length) {
    list.innerHTML = '<div class="empty">No products yet. Add your first product.</div>';
    return;
  }
  list.innerHTML = products.map(p => `
    <article class="product-card">
      ${p.image_url ? `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}">` : ""}
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description || "")}</p>
        <strong>${Number(p.price).toFixed(2)} SEK</strong>
        <small>Stock: ${p.stock}</small>
        <div class="actions">
          <button class="btn secondary" data-edit="${p.id}">Edit</button>
          <button class="btn danger" data-delete="${p.id}">Delete</button>
        </div>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editProduct(b.dataset.edit)));
  list.querySelectorAll("[data-delete]").forEach(b => b.addEventListener("click", () => deleteProduct(b.dataset.delete)));
}

function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

window.openProductModal = () => {
  editingId = null;
  title.textContent = "Add Product";
  form.reset();
  modal?.classList.add("open");
};

window.closeProductModal = () => modal?.classList.remove("open");

async function uploadImage(file) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${currentUser.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type
  });
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

async function editProduct(id) {
  const { data: p, error } = await supabase.from("products").select("*").eq("id", id).eq("seller_id", currentUser.id).single();
  if (error) { message(error.message); return; }
  editingId = id;
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productStock").value = p.stock;
  document.getElementById("productDescription").value = p.description || "";
  title.textContent = "Edit Product";
  modal?.classList.add("open");
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  const { error } = await supabase.from("products").delete().eq("id", id).eq("seller_id", currentUser.id);
  if (error) message(error.message);
  else { message("Product deleted.", true); await loadProducts(); }
}

form?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!currentUser) return;
  const name = document.getElementById("productName").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  const stock = Number(document.getElementById("productStock").value);
  const description = document.getElementById("productDescription").value.trim();
  const file = imageInput?.files?.[0];

  if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    message("Enter a valid name, price and whole-number stock.");
    return;
  }

  try {
    let image_url = null;
    if (file) image_url = await uploadImage(file);

    if (editingId) {
      const update = { name, price, stock, description };
      if (image_url) update.image_url = image_url;
      const { error } = await supabase.from("products").update(update).eq("id", editingId).eq("seller_id", currentUser.id);
      if (error) throw error;
      message("Product updated.", true);
    } else {
      const { error } = await supabase.from("products").insert({
        seller_id: currentUser.id, name, price, stock, description, image_url
      });
      if (error) throw error;
      message("Product added.", true);
    }
    window.closeProductModal();
    await loadProducts();
  } catch (err) {
    message(err.message || "Something went wrong.");
  }
});

start();
