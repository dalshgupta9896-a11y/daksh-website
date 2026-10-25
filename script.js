/* ===== BOOKVERSE script.js ===== */
const BRAND = "BOOKVERSE"; // sample brand name (also edit it in index.html)

/* ---- BOOK LIST: add / edit / delete books here. All are FICTIONAL samples. ----
   pdf: "" means no PDF yet. To add one, put file in a "pdfs" folder and write pdf:"pdfs/mybook.pdf" */
const BOOKS = [
 {id:1,title:"Class 10 Maths Made Simple",author:"A. Verma",cat:"School Education",price:149,old:249,badge:"Bestseller",pages:220,desc:"Chapter-wise notes and solved examples for Class 10 maths.",pdf:""},
 {id:2,title:"Science Stories for Class 8",author:"R. Nair",cat:"School Education",price:129,old:199,badge:"New",pages:180,desc:"Easy science concepts explained through everyday stories.",pdf:""},
 {id:3,title:"Exam Ready: Reasoning Guide",author:"S. Kapoor",cat:"Competitive Exams",price:249,old:399,badge:"Bestseller",pages:310,desc:"Practice sets and shortcuts for reasoning sections.",pdf:""},
 {id:4,title:"General Awareness Sprint",author:"P. Mehta",cat:"Competitive Exams",price:199,old:299,badge:"New",pages:260,desc:"Quick revision notes for competitive exam preparation.",pdf:""},
 {id:5,title:"Startup Money Basics",author:"K. Iyer",cat:"Business & Finance",price:299,old:449,badge:"Bestseller",pages:240,desc:"Understand budgets, profit and simple business finance.",pdf:""},
 {id:6,title:"The Small Business Playbook",author:"M. Rao",cat:"Business & Finance",price:279,old:399,badge:"",pages:200,desc:"Practical steps to plan and grow a small business.",pdf:""},
 {id:7,title:"AI for Everyone",author:"N. Sharma",cat:"Technology & AI",price:349,old:499,badge:"New",pages:280,desc:"A plain-language introduction to artificial intelligence.",pdf:""},
 {id:8,title:"Web Basics in 30 Days",author:"D. Singh",cat:"Technology & AI",price:229,old:329,badge:"Bestseller",pages:230,desc:"Learn HTML, CSS and JavaScript step by step.",pdf:""},
 {id:9,title:"Habits That Stick",author:"T. Bose",cat:"Personal Development",price:179,old:279,badge:"Bestseller",pages:190,desc:"Build routines for study, work and well-being.",pdf:""},
 {id:10,title:"Focus in a Noisy World",author:"L. Dutta",cat:"Personal Development",price:199,old:299,badge:"New",pages:170,desc:"Simple methods to concentrate and finish what matters.",pdf:""},
 {id:11,title:"The Lantern Keeper",author:"I. Menon",cat:"Fiction & Literature",price:159,old:249,badge:"",pages:320,desc:"A gentle fantasy about a village and its last lantern.",pdf:""},
 {id:12,title:"Monsoon Letters",author:"V. Chatterjee",cat:"Fiction & Literature",price:149,old:229,badge:"New",pages:210,desc:"Short stories told through letters across one rainy season.",pdf:""},
 {id:13,title:"Curious Physics",author:"H. Pillai",cat:"Science",price:259,old:379,badge:"Bestseller",pages:270,desc:"Everyday physics, from rainbows to rockets.",pdf:""},
 {id:14,title:"Life on Earth: Biology Tour",author:"G. Reddy",cat:"Science",price:239,old:349,badge:"",pages:250,desc:"A friendly tour through cells, plants and animals.",pdf:""},
 {id:15,title:"Algebra Without Fear",author:"B. Joshi",cat:"Mathematics",price:189,old:289,badge:"New",pages:210,desc:"Algebra explained slowly with lots of worked examples.",pdf:""},
 {id:16,title:"Geometry in Pictures",author:"C. Das",cat:"Mathematics",price:169,old:259,badge:"Bestseller",pages:190,desc:"Visual proofs and puzzles for shapes and angles.",pdf:""}
];
const CATS = [["School Education","🎒","Notes for classes 1–12"],["Competitive Exams","🏆","Prepare and practise"],["Business & Finance","💼","Money and enterprise"],["Technology & AI","🤖","Code and machine learning"],["Personal Development","🌱","Habits and focus"],["Fiction & Literature","📖","Stories to get lost in"],["Science","🔬","Explore the universe"],["Mathematics","📐","Numbers made friendly"]];

/* ---- helpers ---- */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const inr = n => "₹" + n.toLocaleString("en-IN");
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const byId = id => BOOKS.find(b => b.id === id);
let cart = load("bv_cart", []), wish = load("bv_wish", []), recent = load("bv_recent", []);
const F = {q: "", cat: "", sort: "", flag: "", max: 9999};

function cover(b) {
  const h = (b.id * 47) % 360;
  return `<div class="cover" style="background:linear-gradient(145deg,hsl(${h},70%,45%),hsl(${(h + 50) % 360},70%,22%))"><span>${CATS.find(c => c[0] === b.cat)[1]}</span><b>${b.title}</b><small>${b.author}</small></div>`;
}
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; $("#toasts").append(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 2500);
}
function card(b) {
  return `<article class="card" data-tilt>${b.badge ? `<span class="badge">${b.badge === "New" ? "New Arrival" : b.badge}</span>` : ""}${cover(b)}
  <span class="cat">${b.cat}</span><h3>${b.title}</h3><small class="muted">by ${b.author}</small><p>${b.desc}</p>
  <div class="price">${inr(b.price)}<s>${inr(b.old)}</s></div>
  <div class="row"><button class="btn ghost" data-act="view" data-id="${b.id}">View Details</button><button class="heart ${wish.includes(b.id) ? "on" : ""}" data-act="wish" data-id="${b.id}" aria-label="Wishlist">${wish.includes(b.id) ? "♥" : "♡"}</button></div>
  <div class="row"><button class="btn ghost" data-act="add" data-id="${b.id}">Add to Cart</button><button class="btn primary" data-act="buy" data-id="${b.id}">Buy Now</button></div></article>`;
}

/* ---- render lists ---- */
function renderGrid() {
  const q = F.q.toLowerCase();
  let list = BOOKS.filter(b => (!q || (b.title + b.author + b.cat).toLowerCase().includes(q)) && (!F.cat || b.cat === F.cat) && b.price <= F.max && (!F.flag || (F.flag === "best" ? b.badge === "Bestseller" : b.badge === "New")));
  if (F.sort === "pl") list.sort((a, b) => a.price - b.price);
  if (F.sort === "ph") list.sort((a, b) => b.price - a.price);
  if (F.sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
  if (F.sort === "new") list.sort((a, b) => b.id - a.id);
  $("#result").textContent = `${list.length} book${list.length === 1 ? "" : "s"} found${F.cat ? " in " + F.cat : ""}`;
  $("#grid").innerHTML = list.length ? list.map(card).join("") : `<div class="empty"><big>🔎</big><h3>No books found</h3><p>Try another word or click Clear Filters.</p></div>`;
}
function renderOthers() {
  $("#cats").innerHTML = CATS.map(c => `<button class="catc ${F.cat === c[0] ? "on" : ""}" data-act="cat" data-c="${c[0]}"><i>${c[1]}</i><b>${c[0]}</b><br><small>${c[2]}</small></button>`).join("");
  $("#car").innerHTML = BOOKS.filter(b => b.badge === "Bestseller").map(card).join("");
  const r = recent.map(byId).filter(Boolean);
  $("#recent").hidden = !r.length; $("#recentList").innerHTML = r.map(card).join("");
  $("#heroBooks").insertAdjacentHTML("beforeend", "");
}
function refresh() { renderGrid(); renderOthers(); $("#wCount").textContent = wish.length; $("#cCount").textContent = cart.length; save("bv_cart", cart); save("bv_wish", wish); save("bv_recent", recent); }

/* ---- modal ---- */
let lastFocus = null;
function openModal(html) {
  lastFocus = document.activeElement;
  $("#box").innerHTML = `<button class="x" data-act="close" aria-label="Close">✕</button>` + html;
  $("#modal").classList.add("show"); $("#box").focus();
}
function closeModal() { $("#modal").classList.remove("show"); if (lastFocus) lastFocus.focus(); }
function details(id) {
  const b = byId(id); recent = [id, ...recent.filter(x => x !== id)].slice(0, 6); refresh();
  const rel = BOOKS.filter(x => x.cat === b.cat && x.id !== id).concat(BOOKS.filter(x => x.cat !== b.cat)).slice(0, 4);
  openModal(`<div class="det"><div>${cover(b)}</div><div><span class="cat">${b.cat}</span><h2>${b.title}</h2><p class="muted">by ${b.author}</p>
  <div class="meta"><span>${b.pages} pages</span><span>PDF</span><span>English</span><span>Demo price ${inr(b.price)}</span></div><p>${b.desc}</p>
  <ul><li>Clear, step-by-step explanations</li><li>Examples and practice ideas</li><li>Sample content — no real book</li></ul>
  <div class="row"><button class="btn primary" data-act="add" data-id="${id}">Add to Cart</button><button class="btn ghost" data-act="buy" data-id="${id}">Buy Now</button><button class="heart ${wish.includes(id) ? "on" : ""}" data-act="wish" data-id="${id}" aria-label="Wishlist">${wish.includes(id) ? "♥" : "♡"}</button>
  ${b.pdf ? `<a class="btn ghost" href="${b.pdf}" target="_blank" rel="noopener">Preview PDF</a>` : `<button class="btn ghost" disabled>Preview Coming Soon</button>`}</div>
  <h3 style="margin-top:20px">Related books</h3><div class="mini">${rel.map(x => `<button data-act="view" data-id="${x.id}" aria-label="${x.title}">${cover(x)}</button>`).join("")}</div></div></div>`);
}
function listHtml(ids, btn) { return ids.map(id => { const b = byId(id); return `<div class="li"><span><b>${b.title}</b><br><small class="muted">${b.author} · ${inr(b.price)}</small></span><span class="row">${btn(b)}</span></div>`; }).join(""); }
function openCart() {
  const total = cart.reduce((s, id) => s + byId(id).price, 0);
  openModal(`<h2>Your Cart</h2>` + (cart.length ? listHtml(cart, b => `<button class="btn ghost" data-act="rm" data-id="${b.id}">Remove</button>`) + `<h3 style="margin:16px 0">Subtotal: ${inr(total)}</h3><p class="muted">Digital books: one copy per title is enough.</p><div class="row"><button class="btn primary" data-act="checkout">Checkout (Demo)</button><button class="btn ghost" data-act="clearCart">Clear Cart</button></div>` : `<div class="empty"><big>🛍</big><p>Your cart is empty. Add a book!</p></div>`));
}
function openWish() {
  openModal(`<h2>Wishlist</h2>` + (wish.length ? listHtml(wish, b => `<button class="btn ghost" data-act="add" data-id="${b.id}">Add to Cart</button><button class="btn ghost" data-act="wish" data-id="${b.id}">Remove</button>`) : `<div class="empty"><big>♡</big><p>No favourites yet. Tap a heart on any book.</p></div>`));
}
let checkoutIds = [];
function checkout(ids) {
  checkoutIds = ids; const total = ids.reduce((s, id) => s + byId(id).price, 0);
  openModal(`<h2>Checkout</h2><div class="warn">DEMO CHECKOUT — NO REAL PAYMENT WILL BE PROCESSED.</div>${listHtml(ids, () => "")}<h3 style="margin:16px 0">Total: ${inr(total)}</h3><p class="muted">We never ask for card, UPI or bank details.</p><button class="btn primary" data-act="done">Complete Demo Purchase</button>`);
}
function done() {
  const no = "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const pdfs = checkoutIds.map(byId).filter(b => b.pdf);
  if (checkoutIds.length === cart.length || cart.length && checkoutIds.every(i => cart.includes(i))) cart = cart.filter(i => !checkoutIds.includes(i));
  refresh();
  openModal(`<div class="ok"><div class="tick">✓</div><h2>Demo order created</h2><p>Order number: <b>${no}</b></p><p class="muted">No payment was collected and no real purchase happened. This is only a demonstration.</p>${pdfs.map(b => `<p><a class="btn ghost" href="${b.pdf}" target="_blank" rel="noopener">Open sample PDF: ${b.title}</a></p>`).join("") || `<p class="muted">No complete book file is included in this demo.</p>`}<button class="btn primary" data-act="close">Continue Exploring</button></div>`);
}

/* ---- all clicks in one place ---- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act],[data-flag]"); if (!t) { if (e.target.id === "modal") closeModal(); return; }
  const id = +t.dataset.id, a = t.dataset.act;
  if (t.dataset.flag !== undefined && !a) { F.flag = t.dataset.flag; $$("[data-flag]").forEach(c => c.classList.toggle("on", c === t)); return renderGrid(); }
  if (a === "closeAnn") $("#announce").remove();
  else if (a === "search") { $("#explore").scrollIntoView(); setTimeout(() => $("#q").focus(), 500); }
  else if (a === "theme") { const d = document.documentElement; d.dataset.theme = d.dataset.theme === "dark" ? "light" : "dark"; save("bv_theme", d.dataset.theme); }
  else if (a === "burger") { const o = $("#menu").classList.toggle("open"); t.setAttribute("aria-expanded", o); }
  else if (a === "wishlist") openWish();
  else if (a === "cart") openCart();
  else if (a === "view") details(id);
  else if (a === "wish") { wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id]; toast(wish.includes(id) ? "Added to wishlist ♥" : "Removed from wishlist"); refresh(); if ($("#box").querySelector(".li") && $("#box h2").textContent === "Wishlist") openWish(); else if ($("#modal.show .det")) details(id); }
  else if (a === "add") { if (cart.includes(id)) toast("Already in cart — one copy is enough for digital books."); else { cart.push(id); toast("Added to cart 🛍"); $("#cartBtn").classList.add("bump"); setTimeout(() => $("#cartBtn").classList.remove("bump"), 500); } refresh(); }
  else if (a === "rm") { cart = cart.filter(x => x !== id); refresh(); openCart(); }
  else if (a === "clearCart") { cart = []; refresh(); openCart(); toast("Cart cleared"); }
  else if (a === "buy") checkout([id]);
  else if (a === "checkout") checkout([...cart]);
  else if (a === "done") done();
  else if (a === "close") closeModal();
  else if (a === "cat") { F.cat = F.cat === t.dataset.c ? "" : t.dataset.c; refresh(); $("#explore").scrollIntoView(); }
  else if (a === "clear") { Object.assign(F, {q: "", cat: "", sort: "", flag: "", max: 9999}); $("#q").value = ""; $("#sort").value = ""; $("#price").value = 9999; $$("[data-flag]").forEach((c, i) => c.classList.toggle("on", !i)); refresh(); }
  else if (a === "prev" || a === "next") $("#car").scrollBy({left: (a === "next" ? 1 : -1) * 280});
  else if (a === "top") scrollTo({top: 0});
  else if (a === "legal") { e.preventDefault(); openModal(`<h2>${t.dataset.t}</h2><p class="muted">Placeholder text for a demo website. Replace this with your own ${t.dataset.t.toLowerCase()} before any real launch.</p>`); }
  if (t.closest("#menu")) $("#menu").classList.remove("open");
});
$("#menu").addEventListener("click", () => $("#menu").classList.remove("open"));
$("#q").addEventListener("input", e => { F.q = e.target.value.trim(); renderGrid(); });
$("#sort").addEventListener("change", e => { F.sort = e.target.value; renderGrid(); });
$("#price").addEventListener("change", e => { F.max = +e.target.value; renderGrid(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
$("#nl").addEventListener("submit", e => {
  e.preventDefault(); const i = $("#nlMail"), ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value);
  i.classList.remove("invalid"); void i.offsetWidth;
  if (ok) { toast("Demo only: email checked, nothing was saved."); i.value = ""; } else { i.classList.add("invalid"); toast("Please enter a valid email."); }
});

/* ---- effects ---- */
const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
document.addEventListener("mousemove", e => {
  document.body.style.setProperty("--mx", e.clientX + "px"); document.body.style.setProperty("--my", e.clientY + "px");
  const c = e.target.closest("[data-tilt]"); $$("[data-tilt]").forEach(x => { if (x !== c) x.style.transform = ""; });
  if (c && !still) { const r = c.getBoundingClientRect(); c.style.transform = `translateY(-6px) rotateY(${((e.clientX - r.left) / r.width - .5) * 10}deg) rotateX(${(.5 - (e.clientY - r.top) / r.height) * 10}deg)`; }
});
$$(".mag").forEach(b => { b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) / 6}px,${(e.clientY - r.top - r.height / 2) / 6}px)`; }); b.addEventListener("mouseleave", () => b.style.transform = ""); });
addEventListener("scroll", () => { $("#nav").classList.toggle("sc", scrollY > 30); $("#top").classList.toggle("show", scrollY > 600); }, {passive: true});
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); if (en.target.dataset.count) count(en.target); io.unobserve(en.target); } }), {threshold: .15});
function count(el) { const n = +el.dataset.count; let i = 0; const s = setInterval(() => { i = Math.min(n, i + Math.ceil(n / 30)); el.textContent = i; if (i >= n) clearInterval(s); }, 40); }

/* ---- start ---- */
document.documentElement.dataset.theme = load("bv_theme", "dark");
$("#yr").textContent = new Date().getFullYear();
$("#heroBooks").insertAdjacentHTML("afterbegin", [1, 7, 13].map(i => cover(byId(i))).join(""));
refresh();
$$(".reveal,[data-count]").forEach(el => io.observe(el));
setTimeout(() => $("#intro").classList.add("done"), still ? 100 : 1800);