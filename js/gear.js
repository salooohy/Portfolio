// General arrangement: a spur gear drawn as an orthographic hidden-line view.
// Drag to rotate, switch projections, and balloons follow their teeth on live leaders.
import * as THREE from "three";
import { LineSegments2 } from "./vendor/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "./vendor/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "./vendor/lines/LineMaterial.js";

const view = document.getElementById("view");
const canvas = document.getElementById("gear");
const overlay = document.getElementById("overlay");
const viewLabel = document.getElementById("viewLabel");
const balloons = [...document.querySelectorAll(".balloon")];
const viewButtons = [...document.querySelectorAll("[data-view]")];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVGNS = "http://www.w3.org/2000/svg";

// ---------- Gear geometry (24 teeth, module 2, 20° pressure angle) ----------
const N = 24, M = 2, PA = (20 * Math.PI) / 180;
const RP = (M * N) / 2, RB = RP * Math.cos(PA), RA = RP + M, RF = RP - 1.25 * M;
const FACE = 6, HUB_R = 9, HUB_L = 12, BORE_R = 6;
const inv = (a) => Math.tan(a) - a;
const halfPitch = Math.PI / (2 * N);
const psi = (r) => halfPitch + inv(PA) - inv(Math.acos(Math.min(1, RB / r)));
const polar = (r, a) => new THREE.Vector2(r * Math.cos(a), r * Math.sin(a));

function gearOutline() {
  const pts = [];
  const step = (2 * Math.PI) / N;
  const psiB = psi(RB), psiA = psi(RA);
  for (let i = 0; i < N; i++) {
    const c = i * step;
    pts.push(polar(RF, c - psiB));
    for (let k = 0; k <= 6; k++) { const r = RB + ((RA - RB) * k) / 6; pts.push(polar(r, c - psi(r))); }
    for (let k = 1; k < 4; k++) pts.push(polar(RA, c - psiA + (2 * psiA * k) / 4));
    for (let k = 6; k >= 0; k--) { const r = RB + ((RA - RB) * k) / 6; pts.push(polar(r, c + psi(r))); }
    pts.push(polar(RF, c + psiB));
    const next = c + step - psiB;
    for (let k = 1; k < 4; k++) pts.push(polar(RF, c + psiB + ((next - (c + psiB)) * k) / 4));
  }
  return pts;
}
function borePath() {
  const p = new THREE.Path();
  const notch = Math.asin(1.5 / BORE_R);
  const start = Math.PI / 2 + notch, end = Math.PI / 2 - notch + 2 * Math.PI;
  for (let k = 0; k <= 40; k++) { const a = start + ((end - start) * k) / 40; const v = polar(BORE_R, a); k ? p.lineTo(v.x, v.y) : p.moveTo(v.x, v.y); }
  const yk = BORE_R + 1.8;
  p.lineTo(1.5, yk); p.lineTo(-1.5, yk); p.closePath();
  return p;
}
function circlePath(cx, cy, r, seg = 48) {
  const p = new THREE.Path();
  for (let k = 0; k <= seg; k++) { const a = (k / seg) * Math.PI * 2; k ? p.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : p.moveTo(cx + r, cy); }
  return p;
}

const outline = gearOutline();

// ---------- Fallback: static front view in SVG when WebGL is unavailable ----------
function fallback() {
  canvas.remove();
  const g = document.createElementNS(SVGNS, "g");
  overlay.appendChild(g);
  let anchors = [];
  const draw = () => {
    const w = view.clientWidth, h = view.clientHeight, s = (h * 0.3) / RA, cx = w / 2, cy = h * 0.47;
    const d = outline.map((v, i) => (i ? "L" : "M") + (cx + v.x * s).toFixed(1) + " " + (cy - v.y * s).toFixed(1)).join(" ") + "Z";
    g.innerHTML = `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${BORE_R * s}" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${RP * s}" fill="none" stroke="var(--ink)" stroke-dasharray="14 4 3 4" opacity=".5"/>`;
    anchors = ANCHOR_ANGLES.map((a) => ({ x: cx + RA * s * Math.cos(a), y: cy - RA * s * Math.sin(a) }));
    placeBalloons(anchors);
  };
  draw();
  addEventListener("resize", draw);
  document.querySelector(".views").hidden = true;
  viewLabel.innerHTML = "<b>Front view</b> &nbsp;Scale 2:1";
}

// ---------- Balloons and leaders ----------
const ANCHOR_ANGLES = [(45 * Math.PI) / 180, (135 * Math.PI) / 180, (315 * Math.PI) / 180];
const BALLOON_POS = [ // fraction of the view: GarBot top right, Basecamp top left, Finance bottom right
  { x: 0.74, y: 0.16, side: 1 },
  { x: 0.2, y: 0.17, side: -1 },
  { x: 0.72, y: 0.8, side: 1 },
];
const BALLOON_POS_NARROW = [
  { x: 0.86, y: 0.08, side: 1 },
  { x: 0.13, y: 0.08, side: -1 },
  { x: 0.86, y: 0.78, side: 1 },
];
const leaderGroup = document.createElementNS(SVGNS, "g");
overlay.appendChild(leaderGroup);
const leaders = balloons.map(() => {
  const l = document.createElementNS(SVGNS, "line"); l.setAttribute("class", "leader");
  const d = document.createElementNS(SVGNS, "circle"); d.setAttribute("class", "leader-dot"); d.setAttribute("r", "3");
  leaderGroup.append(l, d);
  return { l, d };
});
function placeBalloons(anchors) {
  const w = view.clientWidth, h = view.clientHeight, wide = w >= 640;
  const R = wide ? 22 : 18;
  balloons.forEach((b, i) => {
    const pos = wide ? BALLOON_POS[i] : BALLOON_POS_NARROW[i];
    const bx = w * pos.x, by = h * pos.y;
    const flip = wide ? pos.side < 0 : pos.side > 0;
    b.classList.toggle("balloon--flip", flip);
    // the balloon's circle sits at (bx, by)
    b.style.left = bx + "px";
    b.style.top = by + "px";
    b.classList.add("is-placed");
    const a = anchors[i];
    const dx = a.x - bx, dy = a.y - by, len = Math.hypot(dx, dy) || 1;
    const { l, d } = leaders[i];
    l.setAttribute("x1", (bx + (dx / len) * R).toFixed(1)); l.setAttribute("y1", (by + (dy / len) * R).toFixed(1));
    l.setAttribute("x2", a.x.toFixed(1)); l.setAttribute("y2", a.y.toFixed(1));
    d.setAttribute("cx", a.x.toFixed(1)); d.setAttribute("cy", a.y.toFixed(1));
  });
}

// ---------- WebGL scene ----------
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  renderer = null;
}

if (!renderer) {
  fallback();
} else {
  const css = getComputedStyle(document.documentElement);
  const color = (v) => new THREE.Color(css.getPropertyValue(v).trim() || "#000");

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
  camera.position.set(0, 0, 100);

  const pose = new THREE.Group();
  const spin = new THREE.Group();
  pose.add(spin);
  scene.add(pose);

  // body
  const shape = new THREE.Shape(outline);
  shape.holes.push(borePath());
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + Math.PI / 6; shape.holes.push(circlePath(14 * Math.cos(a), 14 * Math.sin(a), 3.2)); }
  const gearGeo = new THREE.ExtrudeGeometry(shape, { depth: FACE, bevelEnabled: false, curveSegments: 24 });
  gearGeo.translate(0, 0, -FACE / 2);

  const hubShape = new THREE.Shape(circlePath(0, 0, HUB_R, 64).getPoints());
  hubShape.holes.push(borePath());
  const hubGeo = new THREE.ExtrudeGeometry(hubShape, { depth: HUB_L, bevelEnabled: false, curveSegments: 32 });
  hubGeo.translate(0, 0, -HUB_L / 2);

  const fill = new THREE.MeshBasicMaterial({ color: color("--sheet"), polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  spin.add(new THREE.Mesh(gearGeo, fill), new THREE.Mesh(hubGeo, fill));

  const visible = new LineMaterial({ color: color("--ink"), linewidth: 1.6 });
  const hidden = new LineMaterial({ color: color("--ink"), linewidth: 1, dashed: true, dashSize: 1.4, gapSize: 1, transparent: true, opacity: 0.32, depthFunc: THREE.GreaterDepth, depthWrite: false });
  const center = new LineMaterial({ color: color("--ink"), linewidth: 0.9, dashed: true, dashSize: 4, gapSize: 1.2, transparent: true, opacity: 0.55 });
  const lineMats = [visible, hidden, center];

  function edges(geo, threshold) {
    const eg = new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geo, threshold));
    const front = new LineSegments2(eg, visible);
    const back = new LineSegments2(eg, hidden);
    back.computeLineDistances();
    back.renderOrder = 2;
    spin.add(front, back);
  }
  edges(gearGeo, 20);
  edges(hubGeo, 20);

  // center lines and pitch circle on the hub face
  const cl = [];
  const z = HUB_L / 2 + 0.05;
  cl.push(-RA - 5, 0, z, RA + 5, 0, z, 0, -RA - 5, z, 0, RA + 5, z);
  for (let k = 0; k < 120; k++) {
    const a0 = (k / 120) * Math.PI * 2, a1 = ((k + 1) / 120) * Math.PI * 2;
    cl.push(RP * Math.cos(a0), RP * Math.sin(a0), FACE / 2 + 0.05, RP * Math.cos(a1), RP * Math.sin(a1), FACE / 2 + 0.05);
  }
  const clGeo = new LineSegmentsGeometry().setPositions(cl);
  const clLine = new LineSegments2(clGeo, center);
  clLine.computeLineDistances();
  spin.add(clLine);

  // ---------- Views ----------
  const q = (x, y, zr = 0) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, zr, "XYZ"));
  const deg = Math.PI / 180;
  const VIEWS = {
    iso: { q: q(35.264 * deg, -45 * deg), label: "<b>Isometric view</b> &nbsp;Scale 2:1 &nbsp;· Drag to rotate" },
    front: { q: q(0, 0), label: "<b>Front view</b> &nbsp;24 teeth · module 2 · 20° pressure angle" },
    top: { q: q(90 * deg, 0), label: "<b>Top view</b> &nbsp;Face width 6 · hub 12" },
    right: { q: q(0, -90 * deg), label: "<b>Right view</b> &nbsp;Hub Ø18 · bore Ø12 with keyway" },
  };
  let current = "iso";
  pose.quaternion.copy(VIEWS.iso.q);
  let tween = null;
  function setView(name) {
    current = name;
    viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === name)));
    viewLabel.innerHTML = VIEWS[name].label;
    showDims(false);
    spin.rotation.z = Math.atan2(Math.sin(spin.rotation.z), Math.cos(spin.rotation.z));
    if (reduceMotion) { pose.quaternion.copy(VIEWS[name].q); if (name === "front") spin.rotation.z = 0; onSettle(); return; }
    tween = { from: pose.quaternion.clone(), to: VIEWS[name].q, spinFrom: spin.rotation.z, t0: performance.now(), dur: 1000 };
  }
  viewButtons.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  function onSettle() { if (current === "front") showDims(true); }

  // ---------- Dimensions (front view only) ----------
  const dimGroup = document.createElementNS(SVGNS, "g");
  dimGroup.setAttribute("class", "dim-g");
  overlay.appendChild(dimGroup);
  function arrow(x, y, dir) { // dir: +1 points right, -1 points left
    return `<path class="dimarrow" d="M${x} ${y} l${-10 * dir} -3.5 l0 7 z"/>`;
  }
  function drawDims() {
    const c = project(new THREE.Vector3(0, 0, 0));
    const e = project(new THREE.Vector3(RA, 0, 0));
    const r = Math.abs(e.x - c.x);
    const rp = r * (RP / RA), rb = r * (BORE_R / RA);
    const y = c.y - r - 34;
    const xl = c.x - r, xr = c.x + r;
    const lx = c.x + rp * Math.cos(-2.4), ly = c.y - rp * Math.sin(-2.4);
    const bx = c.x + rb * Math.cos(2.7), by = c.y - rb * Math.sin(2.7);
    const ex = c.x - r * 1.18, ey = c.y - r * 0.32;
    dimGroup.innerHTML =
      `<path class="dimext" d="M${xl} ${c.y - 6} V${y - 8} M${xr} ${c.y - 6} V${y - 8}"/>` +
      `<path class="dimline" d="M${xl} ${y} H${xr}"/>` + arrow(xl, y, -1) + arrow(xr, y, 1) +
      `<text x="${c.x}" y="${y - 8}" text-anchor="middle">Ø52 OD</text>` +
      `<path class="dimline" d="M${lx} ${ly} L${lx - 46} ${ly + 46} H${lx - 128}"/><circle class="leader-dot" cx="${lx}" cy="${ly}" r="2.5"/>` +
      `<text x="${lx - 128}" y="${ly + 40}">Ø48 PCD</text>` +
      `<path class="dimline" d="M${bx} ${by} L${ex} ${ey} H${ex - 92}"/><circle class="leader-dot" cx="${bx}" cy="${by}" r="2.5"/>` +
      `<text x="${ex - 92}" y="${ey - 7}">Ø12 bore</text>`;
  }
  function showDims(on) {
    if (on) drawDims();
    dimGroup.classList.toggle("is-on", on);
  }

  // ---------- Drag to rotate ----------
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // let touch scroll the page; views buttons handle touch
    drag = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("is-dragging");
    tween = null;
    showDims(false);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag = { x: e.clientX, y: e.clientY };
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.008);
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.008);
    pose.quaternion.premultiply(qy).premultiply(qx);
    if (current) {
      current = null;
      viewButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      viewLabel.innerHTML = "<b>Auxiliary view</b> &nbsp;Free rotation";
    }
  });
  const endDrag = () => { drag = null; canvas.classList.remove("is-dragging"); };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  // ---------- Layout ----------
  let W = 1, H = 1;
  function resize() {
    W = view.clientWidth; H = view.clientHeight;
    renderer.setSize(W, H, false);
    const aspect = W / H;
    // keep the part at ~58% of the shorter side
    const half = (RA * (W < 640 ? 2.05 : 1.72)) / Math.min(1, aspect);
    camera.left = -half * aspect; camera.right = half * aspect; camera.top = half; camera.bottom = -half;
    camera.updateProjectionMatrix();
    lineMats.forEach((m) => m.resolution.set(W, H));
    overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
    if (dimGroup.classList.contains("is-on")) drawDims();
  }
  new ResizeObserver(resize).observe(view);
  resize();

  function project(v) {
    const p = v.clone().project(camera);
    return { x: ((p.x + 1) / 2) * W, y: ((1 - p.y) / 2) * H };
  }

  // ---------- Print style ----------
  document.addEventListener("printchange", () => {
    requestAnimationFrame(() => {
      const s = getComputedStyle(document.documentElement);
      const c = (v) => new THREE.Color(s.getPropertyValue(v).trim());
      fill.color = c("--sheet");
      lineMats.forEach((m) => (m.color = c("--ink")));
      dirty = true;
    });
  });

  // ---------- Loop ----------
  const ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const anchorsLocal = ANCHOR_ANGLES.map((a) => new THREE.Vector3(RA * Math.cos(a), RA * Math.sin(a), FACE / 2));
  let running = true, dirty = true, last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (tween) {
      const t = ease((now - tween.t0) / tween.dur);
      pose.quaternion.slerpQuaternions(tween.from, tween.to, t);
      if (current === "front") spin.rotation.z = tween.spinFrom * (1 - t); // bring teeth square to the dimension
      if (t >= 1) { tween = null; onSettle(); }
      dirty = true;
    } else if (!reduceMotion && !drag && current !== "front") {
      spin.rotation.z += dt * 0.12;
      dirty = true;
    }
    if (drag) dirty = true;
    if (dirty) {
      renderer.render(scene, camera);
      scene.updateMatrixWorld();
      placeBalloons(anchorsLocal.map((p) => project(spin.localToWorld(p.clone()))));
      dirty = false;
    }
    if (running) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // pause when off screen or hidden
  const resume = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  new IntersectionObserver((en) => { if (en[0].isIntersecting && !document.hidden) resume(); else running = false; }).observe(view);
  document.addEventListener("visibilitychange", () => { if (document.hidden) running = false; else resume(); });
  addEventListener("resize", () => (dirty = true));
}
