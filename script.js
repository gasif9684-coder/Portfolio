/* ========== EDIT THIS BLOCK TO CHANGE YOUR INFO ========== */
const ME = {
  name: "Muhammad Asif",
  role: "Software Engineering Student",
  tagline: "I build clean, fast websites and love learning new tech.",
  bio: "I'm a Software Engineering student at SMIU who enjoys turning ideas into working products. I love learning new technologies and building things that people can actually use.",
  email: "gasif9684@gmail.com",

  social: [
    ["Instagram", "https://instagram.com/not_ur_47"],
    ["Email", "mailto:gasif9684@gmail.com"]
  ],

  edu: [
    ["SMIU", "BS Software Engineering (currently studying)"]
  ],

  stats: [
    [1, "Project"],
    [2, "Technologies"],
    [1, "University"]
  ],

  tabs: {
    Projects: [
      ["Portfolio Site", "This website, built with HTML, CSS and JS."],
      ["Responsive Landing Page", "In progress: a mobile-friendly landing page using HTML and CSS."],
      ["Login Page UI", "In progress: a clean login form design using HTML and CSS."]
    ],
    "Tech Stack": ["HTML", "CSS"]
  }
};
/* ========================================================= */


/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[c]));

const safe = (fn) => {
  try {
    return fn();
  } catch (e) {
    return null;
  }
};


/* ---------- Fill page with your info ---------- */
document.title = ME.name + " | Portfolio";
$("role").textContent = ME.role;
$("tagline").textContent = ME.tagline;
$("hi").textContent = "Hi, I'm " + ME.name;
$("bio").textContent = ME.bio;
$("foot").textContent = "© " + new Date().getFullYear() + " " + ME.name;

$("social").innerHTML = ME.social
  .map((s) => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`)
  .join("");

$("edu").innerHTML = ME.edu
  .map((e) => `<li><b>${esc(e[0])}</b><br><small>${esc(e[1])}</small></li>`)
  .join("");

$("stats").innerHTML = ME.stats
  .map((s) => `<div><b>${s[0]}</b>${esc(s[1])}</div>`)
  .join("");


/* ---------- Portfolio tabs ---------- */
const tabNames = Object.keys(ME.tabs);

$("tabs").innerHTML = tabNames
  .map((n, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" data-n="${esc(n)}">${esc(n)}</button>`)
  .join("");

function showTab(name) {
  const data = ME.tabs[name];

  if (name === "Tech Stack") {
    $("panel").innerHTML =
      `<div class="chips">${data.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;
  } else {
    $("panel").innerHTML =
      `<div class="grid">${data
        .map((c) => `<div class="card"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></div>`)
        .join("")}</div>`;
  }

  document.querySelectorAll(".tab").forEach((b) => {
    b.setAttribute("aria-selected", b.dataset.n === name);
  });
}

$("tabs").onclick = (e) => {
  if (e.target.dataset.n) showTab(e.target.dataset.n);
};

showTab(tabNames[0]);


/* ---------- Photo: tap for hero mode, upload your own ---------- */
const photo = $("photo");

photo.onclick = () => photo.classList.toggle("hero-mode");

photo.onkeydown = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    photo.click();
  }
};

$("file").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    $("img").src = reader.result;
    photo.classList.add("has");
  };
  reader.readAsDataURL(file);
};


/* ---------- Music player (visual only) ---------- */
$("play").onclick = () => {
  const playing = $("player").classList.toggle("on");
  $("play").textContent = playing ? "❚❚" : "▶";
};


/* ---------- Contact form (opens email app) ---------- */
$("form").onsubmit = (e) => {
  e.preventDefault();

  const subject = encodeURIComponent("Message from " + $("cname").value);
  const body = encodeURIComponent(
    $("cmsg").value + "\n\n" + $("cname").value + " (" + $("cmail").value + ")"
  );

  location.href = "mailto:" + ME.email + "?subject=" + subject + "&body=" + body;
  $("status").textContent = "Opening your email app...";
};


/* ---------- Comments (saved in this visitor's browser only) ---------- */
let comments = safe(() => JSON.parse(localStorage.getItem("cms"))) || [];

function drawComments() {
  if (!comments.length) {
    $("list").innerHTML = '<p class="muted">No comments yet. Be the first.</p>';
    return;
  }

  $("list").innerHTML = comments
    .map((c) => `
      <div class="cm">
        <div class="av">${esc(c.n[0] || "?").toUpperCase()}</div>
        <div><b>${esc(c.n)}</b><p>${esc(c.t)}</p></div>
      </div>`)
    .join("");
}

$("kadd").onclick = () => {
  const name = $("kname").value.trim() || "Guest";
  const text = $("ktext").value.trim();
  if (!text) return;

  comments.unshift({ n: name, t: text });
  safe(() => localStorage.setItem("cms", JSON.stringify(comments)));
  $("ktext").value = "";
  drawComments();
};

drawComments();


/* ---------- Moving stars background ---------- */
const canvas = $("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeStars() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  stars = Array.from({ length: Math.min(160, innerWidth / 5) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    v: Math.random() * 0.3 + 0.05
  }));
}

resizeStars();
addEventListener("resize", resizeStars);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#cfe3ff";

  for (const s of stars) {
    s.y -= s.v;
    if (s.y < 0) s.y = canvas.height;

    ctx.globalAlpha = 0.4 + s.r / 2.5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 7);
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

animateStars();


/* ---------- Loader (0% to 100%) ---------- */
let progress = 0;

const loaderTimer = setInterval(() => {
  progress += Math.ceil(Math.random() * 6);

  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderTimer);
    setTimeout(() => $("loader").classList.add("done"), 300);
  }

  $("fill").style.width = progress + "%";
  $("pct").textContent = progress + "%";
}, 60);