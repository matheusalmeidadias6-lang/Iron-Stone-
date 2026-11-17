function pegar(seletor) {
  return document.querySelector(seletor);
}

function pegarTodos(seletor) {
  return Array.from(document.querySelectorAll(seletor));
}

function guardar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (erro) {}
}

function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    return null;
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function semAcento(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function criarSlug(texto) {
  return semAcento(texto).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

let tempoAviso = null;
function mostrarAviso(mensagem) {
  const aviso = pegar("#toast");
  aviso.textContent = mensagem;
  aviso.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function () {
    aviso.hidden = true;
  }, 3000);
}

const categorias = ["Camisetas", "Moletons", "Calças", "Bermudas", "Jaquetas", "Acessórios"];

const produtos = [
  { id: 1, nome: "Iron Oversized Tee", categoria: "Camisetas", preco: 129.9, etiqueta: "Novo", maisVendido: true },
  { id: 2, nome: "Concrete Basic Tee", categoria: "Camisetas", preco: 89.9 },
  { id: 3, nome: "Raw Cotton Tee", categoria: "Camisetas", preco: 99.9, promocao: 79.9 },
  { id: 4, nome: "Heavyweight Hoodie", categoria: "Moletons", preco: 249.9, etiqueta: "Destaque", maisVendido: true },
  { id: 5, nome: "Iron Zip Hoodie", categoria: "Moletons", preco: 279.9, etiqueta: "Novo" },
  { id: 6, nome: "Essential Sweatshirt", categoria: "Moletons", preco: 199.9, promocao: 169.9, maisVendido: true },
  { id: 7, nome: "Stone Cargo Pants", categoria: "Calças", preco: 289.9, etiqueta: "Destaque", maisVendido: true },
  { id: 8, nome: "Urban Wide Leg", categoria: "Calças", preco: 259.9, etiqueta: "Novo" },
  { id: 9, nome: "Street Essential Shorts", categoria: "Bermudas", preco: 149.9 },
  { id: 10, nome: "Urban Jacket", categoria: "Jaquetas", preco: 399.9, etiqueta: "Destaque" },
  { id: 11, nome: "Concrete Overshirt", categoria: "Jaquetas", preco: 329.9, promocao: 289.9 },
  { id: 12, nome: "Stone Cap", categoria: "Acessórios", preco: 79.9, maisVendido: true }
];

const fotosDisponiveis = [];

function precoFinal(produto) {
  if (produto.promocao) {
    return produto.promocao;
  }
  return produto.preco;
}

function buscarProduto(id) {
  return produtos.find(function (produto) {
    return produto.id === id;
  });
}

function textoPreco(produto) {
  if (produto.promocao) {
    return "<s>" + formatarPreco(produto.preco) + "</s>" + formatarPreco(produto.promocao);
  }
  return formatarPreco(produto.preco);
}

function tagFoto(arquivo, descricao) {
  if (fotosDisponiveis.includes(arquivo)) {
    return '<img src="assets/images/' + arquivo + '" alt="' + descricao + '" loading="lazy">';
  }
  return "";
}

function moldura(nome, descricao) {
  const arquivo = criarSlug(nome) + ".jpg";
  return '<div class="ph" data-slot="' + arquivo + '">' + tagFoto(arquivo, descricao) + "</div>";
}

function colocarFotosFixas() {
  pegarTodos(".ph[data-alt]").forEach(function (elemento) {
    elemento.insertAdjacentHTML("afterbegin", tagFoto(elemento.dataset.slot, elemento.dataset.alt));
  });
}

const filtros = { busca: "", categoria: "", preco: "", novidades: false, maisVendidos: false, ordem: "recentes" };

function passaNoPreco(produto) {
  const valor = precoFinal(produto);
  if (filtros.preco === "0-100") {
    return valor <= 100;
  }
  if (filtros.preco === "100-200") {
    return valor > 100 && valor <= 200;
  }
  if (filtros.preco === "200+") {
    return valor > 200;
  }
  return true;
}

function filtrarProdutos() {
  const lista = produtos.filter(function (produto) {
    const texto = semAcento(produto.nome + " " + produto.categoria);
    const busca = semAcento(filtros.busca.trim());
    if (filtros.categoria && produto.categoria !== filtros.categoria) return false;
    if (!texto.includes(busca)) return false;
    if (filtros.novidades && produto.etiqueta !== "Novo") return false;
    if (filtros.maisVendidos && !produto.maisVendido) return false;
    return passaNoPreco(produto);
  });

  lista.sort(function (a, b) {
    if (filtros.ordem === "asc") return precoFinal(a) - precoFinal(b);
    if (filtros.ordem === "desc") return precoFinal(b) - precoFinal(a);
    return b.id - a.id;
  });

  return lista;
}

function mostrarProdutos() {
  const lista = filtrarProdutos();
  let html = "";

  lista.forEach(function (produto) {
    html += '<li class="col"><article class="produto">';
    if (produto.etiqueta) {
      html += '<span class="tag">' + produto.etiqueta + "</span>";
    }
    html += moldura(produto.nome, produto.nome);
    html += "<h3>" + produto.nome + "</h3>";
    html += "<p>" + produto.categoria + "</p>";
    html += '<p class="price">' + textoPreco(produto) + "</p>";
    html += '<div class="d-flex gap-2 align-items-center flex-wrap">';
    html += '<button class="btn flex-fill" data-view="' + produto.id + '">Ver</button>';
    html += '<button class="btn flex-fill" data-add="' + produto.id + '" aria-label="Adicionar ' + produto.nome + ' à sacola">Adicionar</button>';
    html += "</div></article></li>";
  });

  pegar("#grid").innerHTML = html;

  if (lista.length > 0) {
    pegar("#count").textContent = lista.length + " produto(s) encontrado(s).";
  } else {
    pegar("#count").textContent = "Nenhum produto encontrado. Limpe os filtros ou tente outra palavra.";
  }

  pegarTodos("#chips button").forEach(function (botao) {
    botao.setAttribute("aria-pressed", botao.dataset.chip === filtros.categoria);
  });
}

function montarCategorias() {
  let botoes = '<button type="button" class="btn" data-chip="" aria-pressed="false">Todas</button>';
  let cartoes = "";
  let links = "";

  categorias.forEach(function (categoria) {
    const arquivo = "cat-" + criarSlug(categoria) + ".jpg";
    botoes += '<button type="button" class="btn" data-chip="' + categoria + '" aria-pressed="false">' + categoria + "</button>";
    cartoes += '<li class="col"><button class="cat" data-cat="' + categoria + '" aria-label="Explorar ' + categoria + '">';
    cartoes += '<div class="ph" data-slot="' + arquivo + '">' + tagFoto(arquivo, "") + "</div>";
    cartoes += '<span>' + categoria + '<span aria-hidden="true">→</span></span></button></li>';
    links += '<a href="#produtos" data-cat="' + categoria + '">' + categoria + "</a>";
  });

  pegar("#chips").innerHTML = botoes;
  pegar("#catGrid").innerHTML = cartoes;
  pegar("#footCats").innerHTML = links;
}

function escolherCategoria(categoria) {
  filtros.categoria = categoria;
  mostrarProdutos();
}

pegar("#q").addEventListener("input", function (evento) {
  filtros.busca = evento.target.value;
  mostrarProdutos();
});

pegar("#price").addEventListener("change", function (evento) {
  filtros.preco = evento.target.value;
  mostrarProdutos();
});

pegar("#sort").addEventListener("change", function (evento) {
  filtros.ordem = evento.target.value;
  mostrarProdutos();
});

pegar("#fNew").addEventListener("change", function (evento) {
  filtros.novidades = evento.target.checked;
  mostrarProdutos();
});

pegar("#fBest").addEventListener("change", function (evento) {
  filtros.maisVendidos = evento.target.checked;
  mostrarProdutos();
});

pegar("#clear").addEventListener("click", function () {
  filtros.busca = "";
  filtros.categoria = "";
  filtros.preco = "";
  filtros.novidades = false;
  filtros.maisVendidos = false;
  filtros.ordem = "recentes";
  pegar("#q").value = "";
  pegar("#price").value = "";
  pegar("#sort").value = "recentes";
  pegar("#fNew").checked = false;
  pegar("#fBest").checked = false;
  mostrarProdutos();
});

pegar("#searchBtn").addEventListener("click", function () {
  pegar("#produtos").scrollIntoView();
  pegar("#q").focus();
});

const FRETE_GRATIS = 199;
let sacola = [];

function carregarSacola() {
  try {
    const salva = JSON.parse(ler("bag") || "[]");
    sacola = salva.filter(function (item) {
      return buscarProduto(item.id);
    });
  } catch (erro) {
    sacola = [];
  }
}

function mostrarSacola() {
  let quantidade = 0;
  let subtotal = 0;
  let html = "";

  sacola.forEach(function (item) {
    const produto = buscarProduto(item.id);
    const total = precoFinal(produto) * item.qtd;
    quantidade += item.qtd;
    subtotal += total;

    html += '<li class="border-bottom py-3"><div class="d-flex justify-content-between"><div><strong>' + produto.nome + "</strong><br>" + formatarPreco(precoFinal(produto)) + "</div>";
    html += "<strong>" + formatarPreco(total) + "</strong></div>";
    html += '<div class="d-flex gap-2 align-items-center flex-wrap">';
    html += '<button class="btn btn-sm" data-dec="' + produto.id + '" aria-label="Diminuir quantidade de ' + produto.nome + '">−</button>';
    html += '<span aria-label="Quantidade">' + item.qtd + "</span>";
    html += '<button class="btn btn-sm" data-inc="' + produto.id + '" aria-label="Aumentar quantidade de ' + produto.nome + '">+</button>';
    html += '<button class="btn btn-sm" data-rm="' + produto.id + '">Remover</button>';
    html += "</div></li>";
  });

  pegar("#bagList").innerHTML = html;
  pegar("#bagCount").textContent = quantidade;
  pegar("#bagBtn").setAttribute("aria-label", "Abrir sacola, " + quantidade + " item(ns)");
  pegar("#bagEmpty").hidden = quantidade > 0;
  pegar("#bagSum").hidden = quantidade === 0;
  pegar("#subtotal").textContent = formatarPreco(subtotal);

  if (subtotal >= FRETE_GRATIS) {
    pegar("#ship").textContent = "Você ganhou frete grátis.";
  } else {
    pegar("#ship").textContent = "Faltam " + formatarPreco(FRETE_GRATIS - subtotal) + " para o frete grátis.";
  }

  guardar("bag", JSON.stringify(sacola));
}

function mudarQuantidade(id, mudanca) {
  const item = sacola.find(function (i) {
    return i.id === id;
  });

  if (item) {
    item.qtd += mudanca;
  } else if (mudanca > 0) {
    sacola.push({ id: id, qtd: mudanca });
  }

  sacola = sacola.filter(function (i) {
    return i.qtd > 0;
  });
  mostrarSacola();
}

function abrirModal(elemento) {
  bootstrap.Modal.getOrCreateInstance(elemento).show();
}

function fecharModal(elemento) {
  const modal = bootstrap.Modal.getInstance(elemento);
  if (modal) {
    modal.hide();
  }
}

pegar("#checkout").addEventListener("click", function () {
  mostrarAviso("Demonstração: nenhum pagamento é processado.");
});

let produtoAberto = null;

function abrirProduto(produto) {
  produtoAberto = produto;
  let html = '<div class="tag position-static d-inline-block">' + (produto.etiqueta || produto.categoria) + "</div>";
  html += moldura(produto.nome, produto.nome);
  html += '<h2 id="vName">' + produto.nome + "</h2>";
  html += "<p>" + produto.categoria + "</p>";
  html += '<p class="price">' + textoPreco(produto) + "</p>";
  pegar("#vBody").innerHTML = html;
  abrirModal(pegar("#viewDlg"));
}

pegar("#vAdd").addEventListener("click", function () {
  mudarQuantidade(produtoAberto.id, 1);
  fecharModal(pegar("#viewDlg"));
  mostrarAviso(produtoAberto.nome + " adicionado à sacola.");
});

function fecharMenu() {
  const menu = bootstrap.Collapse.getInstance(pegar("#nav"));
  if (menu) {
    menu.hide();
  }
}

pegarTodos("#nav a:not([data-cat]):not([data-new])").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});

document.addEventListener("click", function (evento) {
  const alvo = evento.target.closest("[data-add],[data-view],[data-inc],[data-dec],[data-rm],[data-chip],[data-cat],[data-new]");
  if (!alvo) return;
  const dados = alvo.dataset;

  if (dados.add) {
    mudarQuantidade(Number(dados.add), 1);
    mostrarAviso(buscarProduto(Number(dados.add)).nome + " adicionado à sacola.");
  } else if (dados.inc) {
    mudarQuantidade(Number(dados.inc), 1);
  } else if (dados.dec) {
    mudarQuantidade(Number(dados.dec), -1);
  } else if (dados.rm) {
    sacola = sacola.filter(function (i) {
      return i.id !== Number(dados.rm);
    });
    mostrarSacola();
  } else if (dados.view) {
    abrirProduto(buscarProduto(Number(dados.view)));
  } else if (dados.chip !== undefined) {
    escolherCategoria(dados.chip);
  } else if (dados.cat !== undefined) {
    filtros.novidades = false;
    pegar("#fNew").checked = false;
    escolherCategoria(dados.cat);
    if (alvo.tagName === "BUTTON") {
      pegar("#produtos").scrollIntoView();
    }
    fecharMenu();
  } else if (dados.new) {
    filtros.novidades = true;
    pegar("#fNew").checked = true;
    escolherCategoria("");
    fecharMenu();
  }
});

const destaques = produtos.filter(function (produto) {
  return produto.etiqueta === "Destaque";
});
let slideAtual = 0;
let relogio = null;

function montarCarrossel() {
  let slidesHtml = "";
  let pontosHtml = "";

  destaques.forEach(function (produto, i) {
    slidesHtml += '<div class="slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " de " + destaques.length + '">';
    slidesHtml += moldura(produto.nome, produto.nome);
    slidesHtml += "<div><h3>" + produto.nome + "</h3><p>" + produto.categoria + "</p>";
    slidesHtml += '<p class="price">' + textoPreco(produto) + "</p>";
    slidesHtml += '<button class="btn btn-brand" data-add="' + produto.id + '">Comprar</button></div></div>';
    pontosHtml += '<button type="button" class="dot" aria-label="Ir para o slide ' + (i + 1) + '" data-k="' + i + '"></button>';
  });

  pegar("#slides").innerHTML = slidesHtml;
  pegar("#dots").innerHTML = pontosHtml;
}

function mostrarSlide(numero) {
  const slides = pegarTodos(".slide");
  slideAtual = (numero + slides.length) % slides.length;

  slides.forEach(function (slide, i) {
    slide.classList.toggle("on", i === slideAtual);
  });
  pegarTodos(".dot").forEach(function (ponto, i) {
    ponto.setAttribute("aria-current", i === slideAtual);
  });
  pegar("#pos").textContent = "Slide " + (slideAtual + 1) + " de " + slides.length;
}

function pararCarrossel() {
  clearInterval(relogio);
  relogio = null;
}

function iniciarCarrossel() {
  pararCarrossel();
  relogio = setInterval(function () {
    mostrarSlide(slideAtual + 1);
  }, 6000);
}

pegar("#prev").addEventListener("click", function () {
  mostrarSlide(slideAtual - 1);
});

pegar("#next").addEventListener("click", function () {
  mostrarSlide(slideAtual + 1);
});

pegar("#dots").addEventListener("click", function (evento) {
  const ponto = evento.target.closest(".dot");
  if (ponto) {
    mostrarSlide(Number(ponto.dataset.k));
  }
});

pegar("#pause").addEventListener("click", function (evento) {
  const botao = evento.target;
  const pausado = botao.getAttribute("aria-pressed") === "true";
  botao.setAttribute("aria-pressed", !pausado);
  if (pausado) {
    botao.textContent = "Pausar";
    iniciarCarrossel();
  } else {
    botao.textContent = "Continuar";
    pararCarrossel();
  }
});

const raiz = document.documentElement;
let tamanhoFonte = Number(ler("fs") || 100);

function aplicarFonte() {
  raiz.style.setProperty("--fs", tamanhoFonte + "%");
  guardar("fs", tamanhoFonte);
  pegar("#a11yStatus").textContent = "Tamanho da fonte: " + tamanhoFonte + "%";
}

pegar("#fontUp").addEventListener("click", function () {
  tamanhoFonte = Math.min(150, tamanhoFonte + 10);
  aplicarFonte();
});

pegar("#fontDown").addEventListener("click", function () {
  tamanhoFonte = Math.max(80, tamanhoFonte - 10);
  aplicarFonte();
});

pegar("#fontReset").addEventListener("click", function () {
  tamanhoFonte = 100;
  aplicarFonte();
});

function aplicarTema(tema) {
  raiz.dataset.theme = tema;
  raiz.setAttribute("data-bs-theme", tema);
  pegar("#themeBtn").textContent = tema === "dark" ? "Modo claro" : "Modo escuro";
  pegar("#themeBtn").setAttribute("aria-pressed", tema === "dark");
  guardar("theme", tema);
}

pegar("#themeBtn").addEventListener("click", function () {
  if (raiz.dataset.theme === "dark") {
    aplicarTema("light");
  } else {
    aplicarTema("dark");
  }
});

pegar("#contrastChk").addEventListener("change", function (evento) {
  if (evento.target.checked) {
    raiz.dataset.contrast = "high";
  } else {
    raiz.removeAttribute("data-contrast");
  }
});

pegar("#motionChk").addEventListener("change", function (evento) {
  if (evento.target.checked) {
    raiz.dataset.motion = "off";
    pararCarrossel();
  } else {
    raiz.removeAttribute("data-motion");
  }
});

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarCampo(id, mensagem, regra) {
  const campo = pegar("#" + id);
  const erro = pegar("#" + id + "Err");
  const invalido = !regra(campo.value.trim());
  campo.setAttribute("aria-invalid", invalido);
  erro.textContent = invalido ? mensagem : "";
  return !invalido;
}

function ligarFormulario(formulario, regras, aoEnviar) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let tudoCerto = true;
    regras.forEach(function (r) {
      if (!validarCampo(r[0], r[1], r[2])) {
        tudoCerto = false;
      }
    });
    if (tudoCerto) {
      aoEnviar();
    } else {
      formulario.querySelector("[aria-invalid=true]").focus();
    }
  });
}

ligarFormulario(
  pegar("#contactForm"),
  [
    ["cName", "Informe seu nome.", function (v) { return v.length >= 2; }],
    ["cEmail", "Digite um e-mail válido, como nome@email.com.", emailValido],
    ["cSubject", "Informe o assunto (mínimo 3 caracteres).", function (v) { return v.length >= 3; }],
    ["cMsg", "Escreva pelo menos 10 caracteres.", function (v) { return v.length >= 10; }]
  ],
  function () {
    pegar("#contactForm").reset();
    mostrarAviso("Mensagem enviada (demonstração, nada foi armazenado).");
  }
);

const janelaLogin = pegar("#loginDlg");

pegar("#forgot").addEventListener("click", function () {
  if (validarCampo("lEmail", "Digite o e-mail da conta para recuperar a senha.", emailValido)) {
    fecharModal(janelaLogin);
    mostrarAviso("Demonstração: nenhum e-mail foi enviado.");
  }
});

ligarFormulario(
  pegar("#loginForm"),
  [
    ["lEmail", "Digite um e-mail válido.", emailValido],
    ["lPass", "A senha precisa de 6 ou mais caracteres.", function (v) { return v.length >= 6; }]
  ],
  function () {
    fecharModal(janelaLogin);
    pegar("#loginForm").reset();
    pegar("#openLogin").textContent = "Sessão ativa";
    mostrarAviso("Login de demonstração concluído.");
  }
);

const temaSalvo = ler("theme");
if (temaSalvo) {
  aplicarTema(temaSalvo);
} else if (matchMedia("(prefers-color-scheme: dark)").matches) {
  aplicarTema("dark");
} else {
  aplicarTema("light");
}

aplicarFonte();
montarCategorias();
montarCarrossel();
mostrarSlide(0);

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  pegar("#pause").setAttribute("aria-pressed", "true");
  pegar("#pause").textContent = "Continuar";
} else {
  iniciarCarrossel();
}

carregarSacola();
mostrarProdutos();
mostrarSacola();
colocarFotosFixas();
