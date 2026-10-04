const STORAGE_KEYS = { products: "novacart_products_v1", cart: "novacart_cart_v1", favorites: "novacart_favorites_v1", user: "novacart_user_v1" };
const starterProducts = [
  {id:"p1",name:"Sculpted Ceramic Vase",category:"Home",price:1299,description:"A quiet statement piece for your favourite corner.",emoji:"🏺",rating:4.9,badge:"BESTSELLER",color:"#e9dfce"},
  {id:"p2",name:"Everyday Canvas Tote",category:"Accessories",price:899,description:"Room for the essentials and then a little more.",emoji:"👜",rating:4.8,badge:"CUSTOMER LOVE",color:"#e2e8da"},
  {id:"p3",name:"Studio Wireless Headphones",category:"Tech",price:2499,description:"Your own little world, in beautifully clear sound.",emoji:"🎧",rating:4.9,badge:"TOP PICK",color:"#e5e0e9"},
  {id:"p4",name:"Slow Morning Cup",category:"Home",price:549,description:"For the first sip and the five minutes after.",emoji:"☕",rating:4.7,badge:"",color:"#f0e3d5"},
  {id:"p5",name:"Pocket Journal Set",category:"Accessories",price:399,description:"A place for big plans and passing thoughts.",emoji:"📓",rating:4.8,badge:"UNDER ₹500",color:"#e5e8e0"},
  {id:"p6",name:"Daily Glow Candle",category:"Wellness",price:699,description:"Soft light and a warm, comforting scent.",emoji:"🕯️",rating:4.6,badge:"",color:"#f0e2c8"},
  {id:"p7",name:"Desk Companion Lamp",category:"Home",price:1799,description:"A softer glow for late-night ideas.",emoji:"💡",rating:4.8,badge:"NEW",color:"#e8e5d7"},
  {id:"p8",name:"Hydration Bottle",category:"Wellness",price:799,description:"A little reminder to take care of yourself.",emoji:"🧴",rating:4.7,badge:"",color:"#dce8e8"}
];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const readStore = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
const saveStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { showToast("Could not save in this browser."); } };
let products = readStore(STORAGE_KEYS.products, null) || structuredClone(starterProducts);
let cart = readStore(STORAGE_KEYS.cart, {});
let favorites = readStore(STORAGE_KEYS.favorites, []);
let currentCategory = "All";
let searchTerm = "";
let toastTimer;
let currentUser = readStore(STORAGE_KEYS.user, null);
const money = (amount) => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
const productById = (id) => products.find(p => p.id === id);
const safeText = (value) => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function persistProducts() { saveStore(STORAGE_KEYS.products, products); }
function persistCart() { saveStore(STORAGE_KEYS.cart, cart); renderCart(); }
function renderProducts() {
  const filtered = products.filter(p => (currentCategory === "All" || p.category === currentCategory) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const sort = $("#sortSelect").value;
  if (sort === "price-low") filtered.sort((a,b)=>a.price-b.price);
  if (sort === "price-high") filtered.sort((a,b)=>b.price-a.price);
  if (sort === "rating") filtered.sort((a,b)=>b.rating-a.rating);
  $("#productGrid").innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-visual" style="background:${safeText(p.color || "#e8ece3")}" data-add="${safeText(p.id)}" title="Add ${safeText(p.name)} to cart">
        ${p.badge ? `<span class="product-badge">${safeText(p.badge)}</span>` : ""}
        <button class="favorite-btn ${favorites.includes(p.id)?"favorited":""}" data-favorite="${safeText(p.id)}" aria-label="${favorites.includes(p.id)?"Remove from":"Add to"} favourites">${favorites.includes(p.id)?"♥":"♡"}</button>
        <span class="product-symbol">${safeText(p.emoji)}</span>
      </div>
      <div class="product-info"><span class="product-category">${safeText(p.category)}</span>
        <div class="product-name-row"><span class="product-name">${safeText(p.name)}</span><span class="product-rating">★ ${Number(p.rating || 4.8).toFixed(1)}</span></div>
        <p class="product-description">${safeText(p.description)}</p>
        <div class="product-buy-row"><span class="product-price">${money(Number(p.price))}</span><button class="add-btn" data-add="${safeText(p.id)}" aria-label="Add ${safeText(p.name)} to cart">＋</button></div>
      </div>
    </article>`).join("");
  $("#resultsCount").textContent = `Showing ${filtered.length} thoughtfully picked item${filtered.length===1?"":"s"}`;
  $("#emptyState").classList.toggle("hidden", filtered.length !== 0);
  $("#productGrid").classList.toggle("hidden", filtered.length === 0);
  $("#clearFilters").classList.toggle("visible", Boolean(searchTerm) || currentCategory !== "All");
  const allTab = $('.category-tab[data-category="All"] span'); if (allTab) allTab.textContent = String(products.length).padStart(2,"0");
}
function addToCart(id) {
  if (!productById(id)) return;
  cart[id] = (cart[id] || 0) + 1; saveStore(STORAGE_KEYS.cart, cart); renderCart(); showToast(`${productById(id).name} added to your cart.`);
}
function changeQuantity(id, delta) {
  if (!cart[id]) return; cart[id] += delta; if (cart[id] <= 0) delete cart[id]; persistCart();
}
function renderCart() {
  const entries = Object.entries(cart).filter(([id,qty]) => productById(id) && qty > 0);
  const count = entries.reduce((sum,[,qty])=>sum+qty,0);
  const subtotal = entries.reduce((sum,[id,qty])=>sum+productById(id).price*qty,0);
  $("#cartCount").textContent = count; $("#drawerCartCount").textContent = `(${count})`;
  $("#cartItems").innerHTML = entries.map(([id,qty]) => { const p=productById(id); return `<div class="cart-line"><div class="cart-line-art" style="background:${safeText(p.color || "#e8ece3")}">${safeText(p.emoji)}</div><div><h4>${safeText(p.name)}</h4><span class="line-category">${safeText(p.category)}</span><div class="line-price">${money(p.price)}</div><div class="qty-control"><button data-qty="${safeText(id)}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${safeText(id)}" data-delta="1" aria-label="Increase quantity">＋</button></div></div><button class="remove-line" data-remove="${safeText(id)}" aria-label="Remove ${safeText(p.name)}">×</button></div>`; }).join("");
  $("#cartEmpty").classList.toggle("hidden", count !== 0); $("#cartItems").classList.toggle("hidden", count === 0); $("#cartFooter").classList.toggle("hidden", count === 0);
  $("#cartSubtotal").textContent = money(subtotal);
  const remaining = Math.max(0,1999-subtotal);
  $("#shippingMessage").textContent = remaining ? `You're ${money(remaining)} away from free shipping.` : "Lovely! You've unlocked free shipping.";
  $("#shippingProgress").style.width = `${Math.min(100,subtotal/1999*100)}%`;
}
function openCart() { $("#overlay").classList.remove("hidden"); $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
function closeCart() { $("#overlay").classList.add("hidden"); $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
function renderAdminList() {
  $("#adminProductCount").textContent = `${products.length} products`;
  $("#adminList").innerHTML = products.map(p=>`<div class="admin-item"><div class="admin-item-icon" style="background:${safeText(p.color || "#e8ece3")}">${safeText(p.emoji)}</div><div class="admin-item-info"><strong>${safeText(p.name)}</strong><small>${money(p.price)} · ${safeText(p.category)}</small></div><button data-edit="${safeText(p.id)}">Edit</button><button class="delete" data-delete="${safeText(p.id)}">Delete</button></div>`).join("");
}
function resetProductForm() { $("#productForm").reset(); $("#editProductId").value=""; $("#saveProductBtn").innerHTML='Add product <span>＋</span>'; $("#cancelEdit").classList.add("hidden"); }
function startEditProduct(id) {
  const p=productById(id); if(!p)return;
  $("#editProductId").value=p.id; $("#productName").value=p.name; $("#productPrice").value=p.price; $("#productCategory").value=p.category; $("#productDescription").value=p.description; $("#productEmoji").value=p.emoji; $("#saveProductBtn").innerHTML='Save changes <span>↗</span>'; $("#cancelEdit").classList.remove("hidden"); $("#productForm").scrollIntoView({behavior:"smooth",block:"start"});
}
function updateCategory(category) { currentCategory=category; $$(".category-tab").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===category)); renderProducts(); }
$("#productGrid").addEventListener("click", e => {
  const favorite=e.target.closest("[data-favorite]");
  if(favorite){const id=favorite.dataset.favorite;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];saveStore(STORAGE_KEYS.favorites,favorites);renderProducts();return;}
  const add=e.target.closest("[data-add]"); if(add)addToCart(add.dataset.add);
});
$("#categoryTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(btn)updateCategory(btn.dataset.category);});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim();renderProducts();});
$("#sortSelect").addEventListener("change",renderProducts);
$("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";searchTerm="";updateCategory("All");});
$("#resetSearch").addEventListener("click",()=>{$("#searchInput").value="";searchTerm="";updateCategory("All");});
$("#cartBtn").addEventListener("click",openCart); $("#closeCart").addEventListener("click",closeCart); $("#overlay").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",closeCart); $("#continueShopping2").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty)changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));if(remove){delete cart[remove.dataset.remove];persistCart();}});
$("#accountBtn").addEventListener("click",()=>{$("#accountDialog").showModal();if(currentUser){$("#loginName").value=currentUser.name||"";$("#loginEmail").value=currentUser.email||"";}});
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();currentUser={name:$("#loginName").value.trim(),email:$("#loginEmail").value.trim()};saveStore(STORAGE_KEYS.user,currentUser);$("#accountDialog").close();showToast(`Welcome, ${currentUser.name}! Demo sign-in complete.`);});
$("#manageProductsBtn").addEventListener("click",()=>{renderAdminList();resetProductForm();$("#adminDialog").showModal();});
$("#productForm").addEventListener("submit",e=>{
  e.preventDefault();const id=$("#editProductId").value;const existing=id?productById(id):null;
  const item={id:id||`p${Date.now()}`,name:$("#productName").value.trim(),price:Number($("#productPrice").value),category:$("#productCategory").value,description:$("#productDescription").value.trim(),emoji:$("#productEmoji").value.trim(),rating:existing?.rating||4.8,badge:existing?.badge||"",color:existing?.color||["#e8ece3","#e9dfce","#e5e0e9","#dce8e8"][products.length%4]};
  if(!item.name||!Number.isFinite(item.price)||item.price<1||!item.description||!item.emoji){showToast("Please check all product details.");return;}
  if(id){products=products.map(p=>p.id===id?item:p);showToast("Product updated.");}else{products.unshift(item);showToast("Product added to your store.");}
  persistProducts();renderProducts();renderAdminList();resetProductForm();
});
$("#cancelEdit").addEventListener("click",resetProductForm);
$("#adminList").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");
  if(edit)startEditProduct(edit.dataset.edit);
  if(del){const p=productById(del.dataset.delete);if(!p)return;if(!confirm(`Delete "${p.name}" from the catalog?`))return;products=products.filter(x=>x.id!==p.id);delete cart[p.id];favorites=favorites.filter(x=>x!==p.id);persistProducts();saveStore(STORAGE_KEYS.favorites,favorites);saveStore(STORAGE_KEYS.cart,cart);renderProducts();renderCart();renderAdminList();showToast("Product deleted.");}
});
$("#resetProducts").addEventListener("click",()=>{if(!confirm("Restore the original demo products? Your custom product edits will be removed."))return;products=structuredClone(starterProducts);persistProducts();renderProducts();renderAdminList();resetProductForm();showToast("Demo catalog restored.");});
$("#checkoutBtn").addEventListener("click",()=>{if(!Object.keys(cart).length){showToast("Your cart is empty.");return;}closeCart();if(currentUser){$("#checkoutName").value=currentUser.name||"";$("#checkoutEmail").value=currentUser.email||"";}$("#checkoutDialog").showModal();});
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();const orderNo="NC-"+Math.random().toString(36).slice(2,8).toUpperCase();const total=Object.entries(cart).reduce((sum,[id,qty])=>sum+(productById(id)?.price||0)*qty,0);$("#checkoutDialog").close();cart={};saveStore(STORAGE_KEYS.cart,cart);renderCart();e.target.reset();showToast(`Demo order ${orderNo} created · ${money(total)} · no payment taken.`);});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=$("#newsletterEmail").value.trim();$("#newsletterMessage").textContent=`You're on the demo list, ${email}. Thanks!`;e.target.reset();showToast("Thanks for joining the demo newsletter.");});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus();}if(e.key==="Escape")closeCart();});
renderProducts();renderCart();
