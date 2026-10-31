// Shared sheet behaviour: zone borders, print style, plot date, sheet index state, line-draw reveals.
(function () {
  var root = document.documentElement;
  var LETTERS = "ABCDEFGHJKLMNP";

  // Print style (vellum / blueprint)
  var printButtons = document.querySelectorAll("[data-print-set]");
  function currentPrint() {
    if (root.dataset.print) return root.dataset.print;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "blueprint" : "vellum";
  }
  function syncPrint() {
    var p = currentPrint();
    printButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.printSet === p)); });
    document.dispatchEvent(new CustomEvent("printchange", { detail: p }));
  }
  printButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      root.dataset.print = b.dataset.printSet;
      try { localStorage.setItem("print", b.dataset.printSet); } catch (e) {}
      syncPrint();
    });
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncPrint);
  syncPrint();

  // Zone markers around every sheet: numbers across (right to left), letters down
  function zoneCounts(el) {
    var r = el.getBoundingClientRect();
    return {
      cols: Math.max(4, Math.min(8, Math.round(r.width / 200))),
      rows: Math.max(2, Math.min(LETTERS.length, Math.round(r.height / 260)))
    };
  }
  function buildZones(sheet) {
    var old = sheet.querySelector(":scope > .zones");
    if (old) old.remove();
    var c = zoneCounts(sheet);
    var z = document.createElement("div");
    z.className = "zones";
    z.setAttribute("aria-hidden", "true");
    var html = "";
    ["top", "bot"].forEach(function (pos) {
      html += '<div class="zones__row zones__row--' + pos + '">';
      for (var i = c.cols; i >= 1; i--) html += "<span>" + i + "</span>";
      html += "</div>";
    });
    ["l", "r"].forEach(function (pos) {
      html += '<div class="zones__col zones__col--' + pos + '">';
      for (var j = 0; j < c.rows; j++) html += "<span>" + LETTERS[j] + "</span>";
      html += "</div>";
    });
    z.innerHTML = html;
    sheet._zones = c;
    sheet.prepend(z);
  }
  var sheets = Array.prototype.slice.call(document.querySelectorAll(".sheet"));
  function buildAll() { sheets.forEach(buildZones); }
  buildAll();
  var rz;
  window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(buildAll, 150); });
  if (document.fonts) document.fonts.ready.then(buildAll);

  // Plot date in Toronto time
  var plot = document.getElementById("plot");
  if (plot) {
    var fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var tick = function () { plot.textContent = fmt.format(new Date()).replace(",", "") + " Toronto"; };
    tick();
    setInterval(tick, 30000);
  }

  // Sheet index: mark the sheet in view
  var links = document.querySelectorAll(".index__sheets a");
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sheets.forEach(function (s) { if (s.id) io.observe(s); });
  }

  // Line-draw reveals: any .draw svg strokes itself in when scrolled into view
  window.sheetDraw = function (svg) {
    svg.querySelectorAll("path, polyline").forEach(function (p) {
      var len = Math.ceil(p.getTotalLength ? p.getTotalLength() : 2000);
      p.style.setProperty("--len", len);
    });
    if (!("IntersectionObserver" in window)) { svg.classList.add("is-drawn"); return; }
    var o = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { svg.classList.add("is-drawn"); o.disconnect(); }
    }, { threshold: 0.25 });
    o.observe(svg);
  };
})();
