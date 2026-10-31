// Home: revision cloud around the current revision, parts-list detail view.
(function () {
  // Revision cloud: scalloped outline drawn around the current revision block
  var rev = document.querySelector(".rev.is-current");
  var cloud = rev && rev.querySelector(".rev__cloud");
  function scallops(x0, y0, x1, y1, r) {
    // walk the rectangle edge clockwise, bulging outward arcs of radius ~r
    var d = "M" + x0 + " " + y0;
    function edge(ax, ay, bx, by) {
      var len = Math.hypot(bx - ax, by - ay);
      var n = Math.max(2, Math.round(len / (r * 1.6)));
      for (var i = 1; i <= n; i++) {
        var x = ax + (bx - ax) * i / n, y = ay + (by - ay) * i / n;
        var seg = len / n;
        d += " A" + (seg * 0.62).toFixed(1) + " " + (seg * 0.62).toFixed(1) + " 0 0 1 " + x.toFixed(1) + " " + y.toFixed(1);
      }
    }
    edge(x0, y0, x1, y0); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0);
    return d;
  }
  function drawCloud() {
    if (!cloud) return;
    var w = rev.clientWidth, h = rev.clientHeight, inset = 10;
    cloud.setAttribute("viewBox", "0 0 " + w + " " + h);
    var r = w < 600 ? 14 : 20;
    cloud.innerHTML = '<path d="' + scallops(inset, inset, w - inset, h - inset, r) + '"/>';
    if (window.sheetDraw) window.sheetDraw(cloud);
  }
  drawCloud();
  var t;
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { cloud.classList.add("is-drawn"); drawCloud(); }, 150); });
  if (document.fonts) document.fonts.ready.then(function () { var drawn = cloud && cloud.classList.contains("is-drawn"); drawCloud(); if (drawn) cloud.classList.add("is-drawn"); });

  // Parts list: hovering or focusing a row puts that part in the detail view
  var rows = document.querySelectorAll(".bom__table tbody tr");
  var img = document.getElementById("detailImg");
  var schem = document.getElementById("detailSchem");
  var label = document.getElementById("detailLabel");
  var num = document.getElementById("detailN");
  var active = null;
  function show(row) {
    if (row === active) return;
    if (active) active.classList.remove("is-active");
    active = row;
    row.classList.add("is-active");
    var src = row.dataset.detail;
    label.textContent = row.dataset.label;
    num.textContent = row.id.replace("item-", "");
    if (src.indexOf("schem-") === 0) {
      var tpl = document.getElementById(src);
      schem.innerHTML = "";
      schem.appendChild(tpl.content.cloneNode(true));
      schem.classList.add("is-on");
      img.hidden = true;
    } else {
      schem.classList.remove("is-on");
      img.hidden = false;
      img.classList.add("is-wiping");
      img.alt = row.dataset.label;
      img.onload = function () {
        requestAnimationFrame(function () { requestAnimationFrame(function () { img.classList.remove("is-wiping"); }); });
      };
      img.src = src;
      if (img.complete) img.onload();
    }
  }
  rows.forEach(function (row) {
    var link = row.querySelector("th a");
    row.addEventListener("click", function (e) {
      if (e.target.closest("a") || String(getSelection())) return;
      if (e.metaKey || e.ctrlKey) window.open(link.href, "_blank"); else location.href = link.href;
    });
    row.addEventListener("pointerenter", function () { show(row); });
    row.addEventListener("focusin", function () { show(row); });
  });
  if (rows.length) show(rows[0]);

  // Preload the detail images once the parts list approaches
  var parts = document.getElementById("parts");
  if (parts && "IntersectionObserver" in window) {
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      rows.forEach(function (r) { if (r.dataset.detail.indexOf("schem-") !== 0) { var i = new Image(); i.src = r.dataset.detail; } });
    }, { rootMargin: "400px" });
    o.observe(parts);
  }
})();
