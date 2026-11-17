(function () {
  "use strict";
  var raiz = document.documentElement;
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function norm(s) { return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

  // Tema claro/escuro
  var botaoTema = document.getElementById("tema-btn");
  if (botaoTema) {
    botaoTema.addEventListener("click", function () {
      var atual = raiz.dataset.theme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var novo = atual === "dark" ? "light" : "dark";
      raiz.dataset.theme = novo;
      guardar("tema", novo);
    });
  }

  // Listagem com filtros
  var lista = document.getElementById("lista");
  if (lista) {
    var PASSO = 24;
    var cards = Array.prototype.slice.call(lista.querySelectorAll(".card"));
    cards.forEach(function (c) { c._s = norm(c.dataset.s); });
    var q = document.getElementById("f-q"), p = document.getElementById("f-p"),
      y = document.getElementById("f-y"), o = document.getElementById("f-o"),
      contagem = document.getElementById("contagem"), vazio = document.getElementById("vazio"),
      mais = document.getElementById("mais"), limite = PASSO;

    var params = new URLSearchParams(location.search);
    if (params.get("q")) q.value = params.get("q");
    if (params.get("ano")) y.value = params.get("ano");
    if (params.get("pregador")) p.value = params.get("pregador");

    function aplicar(reiniciar) {
      if (reiniciar) limite = PASSO;
      var termos = norm(q.value).split(/\s+/).filter(Boolean);
      var ordem = o.value === "asc" ? 1 : -1;
      var passam = cards.filter(function (c) {
        if (p.value && c.dataset.p !== p.value) return false;
        if (y.value && c.dataset.y !== y.value) return false;
        return termos.every(function (t) { return c._s.indexOf(t) !== -1; });
      });
      passam.sort(function (a, b) { return a.dataset.d < b.dataset.d ? -ordem : a.dataset.d > b.dataset.d ? ordem : 0; });
      cards.forEach(function (c) { c.hidden = true; });
      passam.forEach(function (c, i) { c.hidden = i >= limite; lista.appendChild(c); });
      var n = passam.length;
      contagem.textContent = n === cards.length
        ? "Mostrando " + Math.min(limite, n) + " de " + n + " pregações"
        : n + (n === 1 ? " pregação encontrada" : " pregações encontradas");
      vazio.hidden = n !== 0;
      mais.hidden = n <= limite;

      var u = new URLSearchParams();
      if (q.value) u.set("q", q.value);
      if (y.value) u.set("ano", y.value);
      if (p.value) u.set("pregador", p.value);
      var s = u.toString();
      history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
    }
    [q, p, y, o].forEach(function (el) {
      el.addEventListener(el === q ? "input" : "change", function () { aplicar(true); });
    });
    mais.addEventListener("click", function () { limite += PASSO; aplicar(false); });
    document.getElementById("limpar").addEventListener("click", function () {
      q.value = ""; p.value = ""; y.value = ""; aplicar(true); q.focus();
    });
    aplicar(true);
  }

  // Localizar tema na página de temas
  var campoTema = document.getElementById("f-tema"), temas = document.getElementById("temas");
  if (campoTema && temas) {
    var itens = Array.prototype.slice.call(temas.children);
    itens.forEach(function (li) { li._s = norm(li.dataset.s); });
    campoTema.addEventListener("input", function () {
      var t = norm(campoTema.value.trim());
      itens.forEach(function (li) { li.hidden = !!t && li._s.indexOf(t) === -1; });
    });
  }

  // Índice de temas: filtro por pregador
  var selTema = document.getElementById("t-p"), indice = document.getElementById("indice");
  if (selTema && indice) {
    var secoes = Array.prototype.slice.call(indice.querySelectorAll(".tema"));
    var contT = document.getElementById("t-contagem"), vazioT = document.getElementById("t-vazio");
    var letras = Array.prototype.slice.call(document.querySelectorAll("#t-letras a"));
    var pr = new URLSearchParams(location.search).get("pregador");
    if (pr) selTema.value = pr;
    var filtrarTemas = function () {
      var p = selTema.value, nTemas = 0, ativas = {};
      secoes.forEach(function (sec) {
        var n = 0;
        Array.prototype.forEach.call(sec.querySelectorAll("li"), function (li) {
          var ok = !p || li.dataset.p === p; li.hidden = !ok; if (ok) n++;
        });
        sec.hidden = n === 0;
        sec.querySelector(".tema-n").textContent = n;
        if (n) { nTemas++; ativas[sec.dataset.letra] = true; }
      });
      letras.forEach(function (a) { a.setAttribute("aria-disabled", ativas[a.textContent] ? "false" : "true"); });
      contT.textContent = p ? nTemas + " temas nas pregações de " + p : nTemas + " temas";
      vazioT.hidden = nTemas !== 0;
      var u = new URLSearchParams(); if (p) u.set("pregador", p);
      history.replaceState(null, "", location.pathname + (p ? "?" + u.toString() : "") + location.hash);
    };
    selTema.addEventListener("change", filtrarTemas);
    filtrarTemas();
    // A rolagem nativa até a âncora acontece antes de o filtro reorganizar as
    // colunas; refaz depois do primeiro quadro, já com o layout final.
    var irParaAlvo = function () {
      if (!location.hash) return;
      var alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (alvo && !alvo.hidden) alvo.scrollIntoView({ behavior: "instant", block: "start" });
    };
    requestAnimationFrame(function () { requestAnimationFrame(irParaAlvo); });
    window.addEventListener("load", irParaAlvo);
  }

  // Página da pregação: progresso de leitura e tamanho do texto
  var barra = document.getElementById("progresso");
  if (barra) {
    var marcar = function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0) + "%";
    };
    window.addEventListener("scroll", marcar, { passive: true });
    window.addEventListener("resize", marcar);
    marcar();
  }
  var botoesFonte = document.querySelectorAll("[data-fonte]");
  if (botoesFonte.length) {
    var tamanho = parseFloat(getComputedStyle(raiz).getPropertyValue("--leitura")) || 1.19;
    Array.prototype.forEach.call(botoesFonte, function (b) {
      b.addEventListener("click", function () {
        tamanho = Math.max(0.95, Math.min(1.6, tamanho + 0.08 * parseInt(b.dataset.fonte, 10)));
        raiz.style.setProperty("--leitura", tamanho.toFixed(2) + "rem");
        guardar("fonte", tamanho.toFixed(2));
      });
    });
  }
})();
