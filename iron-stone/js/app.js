/* IRON STONE: loja demonstrativa (sem dependências, sem servidor) */
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const root = document.documentElement;
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const toast = (m) => { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 3000); };

/* ---------- Catálogo (fictício). id maior = mais recente; best = mais vendido ---------- */
const CATS = ["Camisetas", "Moletons", "Calças", "Bermudas", "Jaquetas", "Acessórios"];
const PRODUCTS = [
  { id: 1, n: "Iron Oversized Tee", c: "Camisetas", p: 129.9, tag: "Novo", best: true },
  { id: 2, n: "Concrete Basic Tee", c: "Camisetas", p: 89.9 },
  { id: 3, n: "Raw Cotton Tee", c: "Camisetas", p: 99.9, promo: 79.9 },
  { id: 4, n: "Heavyweight Hoodie", c: "Moletons", p: 249.9, tag: "Destaque", best: true },
  { id: 5, n: "Iron Zip Hoodie", c: "Moletons", p: 279.9, tag: "Novo" },
  { id: 6, n: "Essential Sweatshirt", c: "Moletons", p: 199.9, promo: 169.9, best: true },
  { id: 7, n: "Stone Cargo Pants", c: "Calças", p: 289.9, tag: "Destaque", best: true },
  { id: 8, n: "Urban Wide Leg", c: "Calças", p: 259.9, tag: "Novo" },
  { id: 9, n: "Street Essential Shorts", c: "Bermudas", p: 149.9 },
  { id: 10, n: "Urban Jacket", c: "Jaquetas", p: 399.9, tag: "Destaque" },
  { id: 11, n: "Concrete Overshirt", c: "Jaquetas", p: 329.9, promo: 289.9 },
  { id: 12, n: "Stone Cap", c: "Acessórios", p: 79.9, best: true }
];
const eff = (x) => x.promo || x.p;
const byId = (id) => PRODUCTS.find((x) => x.id === id);
/* FOTOS: nomes dos arquivos que existem em assets/images/. Ao adicionar uma foto, inclua o nome aqui (ex.: "hero.jpg").
   Arquivos fora da lista não são pedidos ao servidor, então não há imagem quebrada nem erro no console. */
const PHOTOS = new Set([]);
const imgTag = (file, alt) => (PHOTOS.has(file) ? `<img src="assets/images/${file}" alt="${alt}" loading="lazy">` : "");
const frame = (name, alt) => `<div class="ph" data-slot="${slug(name)}.jpg">${imgTag(slug(name) + ".jpg", alt)}</div>`;
const hydrate = () => $$(".ph[data-alt]").forEach((el) => { el.insertAdjacentHTML("afterbegin", imgTag(el.dataset.slot, el.dataset.alt)); });
const priceHtml = (x) => x.promo ? `<s>${brl(x.p)}</s>${brl(x.promo)}` : brl(x.p);

/* ---------- Filtros, busca e ordenação ---------- */
const F = { q: "", cat: "", price: "", nw: false, best: false, sort: "rec" };
function render() {
  let l = PRODUCTS.filter((x) => (!F.cat || x.c === F.cat) && norm(x.n + " " + x.c).includes(norm(F.q.trim())) && (!F.nw || x.tag === "Novo") && (!F.best || x.best) &&
    (!F.price || (F.price === "0-100" ? eff(x) <= 100 : F.price === "100-200" ? eff(x) > 100 && eff(x) <= 200 : eff(x) > 200)));
  l.sort((a, b) => F.sort === "asc" ? eff(a) - eff(b) : F.sort === "desc" ? eff(b) - eff(a) : b.id - a.id);
  $("#grid").innerHTML = l.map((x) => `<li class="card">${x.tag ? `<span class="tag">${x.tag}</span>` : ""}${frame(x.n, x.n)}
    <h3>${x.n}</h3><p>${x.c}</p><p class="price">${priceHtml(x)}</p>
    <div class="row"><button data-view="${x.id}">Ver</button><button data-add="${x.id}" aria-label="Adicionar ${x.n} à sacola">Adicionar</button></div></li>`).join("");
  $("#count").textContent = l.length ? `${l.length} produto(s) encontrado(s).` : "Nenhum produto encontrado. Limpe os filtros ou tente outra palavra.";
  $$("#chips button").forEach((b) => b.setAttribute("aria-pressed", (b.dataset.chip || "") === F.cat));
}
$("#chips").innerHTML = ["", ...CATS].map((c) => `<button type="button" data-chip="${c}" aria-pressed="false">${c || "Todas"}</button>`).join("");
$("#catGrid").innerHTML = CATS.map((c) => `<li><button class="cat" data-cat="${c}" aria-label="Explorar ${c}"><div class="ph" data-slot="cat-${slug(c)}.jpg">${imgTag("cat-" + slug(c) + ".jpg", "")}</div><span>${c}<span aria-hidden="true">→</span></span></button></li>`).join("");
$("#footCats").innerHTML = CATS.map((c) => `<a href="#produtos" data-cat="${c}">${c}</a>`).join("");
function setCat(c) { F.cat = c; render(); }
$("#q").oninput = (e) => { F.q = e.target.value; render(); };
$("#price").onchange = (e) => { F.price = e.target.value; render(); };
$("#sort").onchange = (e) => { F.sort = e.target.value; render(); };
$("#fNew").onchange = (e) => { F.nw = e.target.checked; render(); };
$("#fBest").onchange = (e) => { F.best = e.target.checked; render(); };
$("#clear").onclick = () => { Object.assign(F, { q: "", cat: "", price: "", nw: false, best: false, sort: "rec" }); $("#q").value = ""; $("#price").value = ""; $("#sort").value = "rec"; $("#fNew").checked = $("#fBest").checked = false; render(); };
$("#searchBtn").onclick = () => { $("#produtos").scrollIntoView(); $("#q").focus(); };

/* ---------- Sacola (localStorage) ---------- */
let bag = []; try { bag = JSON.parse(store.get("bag") || "[]").filter((i) => byId(i.id)); } catch { bag = []; }
const FREE = 199;
function renderBag() {
  const n = bag.reduce((s, i) => s + i.q, 0), sub = bag.reduce((s, i) => s + eff(byId(i.id)) * i.q, 0);
  $("#bagCount").textContent = n; $("#bagBtn").setAttribute("aria-label", `Abrir sacola, ${n} item(ns)`);
  $("#bagList").innerHTML = bag.map((i) => { const x = byId(i.id); return `<li><div><strong>${x.n}</strong><br>${brl(eff(x))}</div><strong>${brl(eff(x) * i.q)}</strong>
    <div class="row"><button data-dec="${x.id}" aria-label="Diminuir quantidade de ${x.n}">−</button><span aria-label="Quantidade">${i.q}</span><button data-inc="${x.id}" aria-label="Aumentar quantidade de ${x.n}">+</button><button data-rm="${x.id}">Remover</button></div></li>`; }).join("");
  $("#bagEmpty").hidden = n > 0; $("#bagSum").hidden = n === 0;
  $("#subtotal").textContent = brl(sub);
  $("#ship").textContent = sub >= FREE ? "Você ganhou frete grátis." : `Faltam ${brl(FREE - sub)} para o frete grátis.`;
  store.set("bag", JSON.stringify(bag));
}
const add = (id, d = 1) => { const i = bag.find((b) => b.id === id); if (i) i.q += d; else if (d > 0) bag.push({ id, q: d }); bag = bag.filter((b) => b.q > 0); renderBag(); };
const openBag = () => { $("#bag").hidden = false; $("#closeBag").focus(); };
$("#bagBtn").onclick = openBag; $("#closeBag").onclick = () => { $("#bag").hidden = true; $("#bagBtn").focus(); };
$("#checkout").onclick = () => toast("Demonstração: nenhum pagamento é processado.");
let viewing = null;
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-view],[data-inc],[data-dec],[data-rm],[data-chip],[data-cat],[data-new]"); if (!t) return;
  const d = t.dataset;
  if (d.add) { add(+d.add); toast(`${byId(+d.add).n} adicionado à sacola.`); }
  else if (d.inc) add(+d.inc); else if (d.dec) add(+d.dec, -1);
  else if (d.rm) { bag = bag.filter((b) => b.id !== +d.rm); renderBag(); }
  else if (d.view) { viewing = byId(+d.view); $("#vBody").innerHTML = `<div class="tag" style="position:static;display:inline-block">${viewing.tag || viewing.c}</div>${frame(viewing.n, viewing.n)}<h2 id="vName">${viewing.n}</h2><p>${viewing.c}</p><p class="price">${priceHtml(viewing)}</p>`; $("#viewDlg").showModal(); }
  else if (d.chip !== undefined) setCat(d.chip);
  else if (d.cat !== undefined) { F.nw = false; $("#fNew").checked = false; setCat(d.cat); if (t.tagName === "BUTTON") $("#produtos").scrollIntoView(); closeMenu(); }
  else if (d.new) { F.nw = true; $("#fNew").checked = true; setCat(""); closeMenu(); }
});
$("#vAdd").onclick = () => { add(viewing.id); $("#viewDlg").close(); toast(`${viewing.n} adicionado à sacola.`); };
$("#vClose").onclick = () => $("#viewDlg").close();

/* ---------- Menu móvel ---------- */
const closeMenu = () => { $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); };
$("#menuBtn").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", o); };
$$("#nav a:not([data-cat]):not([data-new])").forEach((a) => a.addEventListener("click", closeMenu));

/* ---------- Carrossel de destaques ---------- */
const FEAT = PRODUCTS.filter((x) => x.tag === "Destaque");
$("#slides").innerHTML = FEAT.map((x, i) => `<div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${FEAT.length}">${frame(x.n, x.n)}<div><h3>${x.n}</h3><p>${x.c}</p><p class="price">${priceHtml(x)}</p><button class="cta" data-add="${x.id}">Comprar</button></div></div>`).join("");
$("#dots").innerHTML = FEAT.map((_, k) => `<button type="button" class="dot" aria-label="Ir para o slide ${k + 1}" data-k="${k}"></button>`).join("");
const slides = $$(".slide"); let cur = 0, timer = null;
function show(i) { cur = (i + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle("on", k === cur)); $("#pos").textContent = `Slide ${cur + 1} de ${slides.length}`; $$(".dot").forEach((d, k) => d.setAttribute("aria-current", k === cur)); }
const stop = () => { clearInterval(timer); timer = null; }, play = () => { stop(); timer = setInterval(() => show(cur + 1), 6000); };
$("#prev").onclick = () => show(cur - 1); $("#next").onclick = () => show(cur + 1);
$("#dots").addEventListener("click", (e) => { const d = e.target.closest(".dot"); if (d) show(+d.dataset.k); });
$("#pause").onclick = (e) => { const p = e.target.getAttribute("aria-pressed") === "true"; e.target.setAttribute("aria-pressed", !p); e.target.textContent = p ? "Pausar" : "Continuar"; p ? play() : stop(); };
show(0);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) play(); else { $("#pause").setAttribute("aria-pressed", "true"); $("#pause").textContent = "Continuar"; }

/* ---------- Painel de acessibilidade ---------- */
const panel = $("#a11y"), openBtn = $("#openA11y");
openBtn.onclick = () => { panel.hidden = !panel.hidden; openBtn.setAttribute("aria-expanded", !panel.hidden); if (!panel.hidden) $("#fontUp").focus(); };
document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (!panel.hidden) { panel.hidden = true; openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); } else if (!$("#bag").hidden) $("#closeBag").click(); });
let fs = +(store.get("fs") || 100);
const applyFs = () => { root.style.setProperty("--fs", fs + "%"); store.set("fs", fs); $("#a11yStatus").textContent = `Tamanho da fonte: ${fs}%`; };
$("#fontUp").onclick = () => { fs = Math.min(150, fs + 10); applyFs(); }; $("#fontDown").onclick = () => { fs = Math.max(80, fs - 10); applyFs(); }; $("#fontReset").onclick = () => { fs = 100; applyFs(); };
applyFs();
function setTheme(t) { root.dataset.theme = t; $("#themeBtn").textContent = t === "dark" ? "Modo claro" : "Modo escuro"; $("#themeBtn").setAttribute("aria-pressed", t === "dark"); store.set("theme", t); }
setTheme(store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");
$("#contrastChk").onchange = (e) => { e.target.checked ? (root.dataset.contrast = "high") : root.removeAttribute("data-contrast"); };
$("#motionChk").onchange = (e) => { e.target.checked ? (root.dataset.motion = "off", stop()) : root.removeAttribute("data-motion"); };

/* ---------- Formulários ---------- */
const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
function check(id, msg, valid) { const f = $("#" + id), e = $("#" + id + "Err"); const bad = !valid(f.value.trim()); f.setAttribute("aria-invalid", bad); e.textContent = bad ? msg : ""; return !bad; }
function wire(form, rules, done) { form.addEventListener("submit", (ev) => { ev.preventDefault(); const r = rules.map((x) => check(...x)); if (r.every(Boolean)) done(); else form.querySelector("[aria-invalid=true]").focus(); }); }
wire($("#contactForm"), [["cName", "Informe seu nome.", (v) => v.length >= 2], ["cEmail", "Digite um e-mail válido, como nome@email.com.", okEmail], ["cSubject", "Informe o assunto (mínimo 3 caracteres).", (v) => v.length >= 3], ["cMsg", "Escreva pelo menos 10 caracteres.", (v) => v.length >= 10]],
  () => { $("#contactForm").reset(); toast("Mensagem enviada (demonstração, nada foi armazenado)."); });
const dlg = $("#loginDlg");
$("#openLogin").onclick = () => dlg.showModal(); $("#closeLogin").onclick = () => dlg.close();
$("#forgot").onclick = () => { if (check("lEmail", "Digite o e-mail da conta para recuperar a senha.", okEmail)) { dlg.close(); toast("Demonstração: nenhum e-mail foi enviado."); } };
wire($("#loginForm"), [["lEmail", "Digite um e-mail válido.", okEmail], ["lPass", "A senha precisa de 6 ou mais caracteres.", (v) => v.length >= 6]],
  () => { dlg.close(); $("#loginForm").reset(); $("#openLogin").textContent = "Sessão ativa"; toast("Login de demonstração concluído."); });
render(); renderBag(); hydrate();
