/* ============================================
   Tech Community — Shared App Script
   ============================================ */

// --- Data store (simulated DB via JS array, persisted in localStorage) ---
const STORAGE_KEY = 'tc_members_v1';

const seedMembers = [];

function loadMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...seedMembers];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [...seedMembers];
  } catch (e) {
    return [...seedMembers];
  }
}

function saveMembers(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
}

function addMember(member) {
  const list = loadMembers();
  list.push(member);
  saveMembers(list);
  return list;
}

// --- Helpers ---
function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>\"']/g, s => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', \"'\":'&#39;' }[s]
  ));
}

// --- Reveal on scroll ---
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// --- Active nav link highlighting ---
function initActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link, .nav-cta').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (
      (path === 'index.html' || path === '') && (href === 'index.html' || href === './' || href === '/') ||
      href === path
    ) a.classList.add('active');
  });
}

// --- Render members table on home page ---
function renderMembers() {
  const tbody = document.getElementById('members-tbody');
  const counter = document.getElementById('members-count');
  if (!tbody) return;
  const list = loadMembers();
  if (counter) counter.textContent = String(list.length).padStart(2, '0');
  if (!list.length) {
    tbody.innerHTML = `
      <tr class=\"empty-row\" data-testid=\"members-empty\">
        <td colspan=\"3\">
          Belum ada anggota terdaftar. <a href=\"form.html\" style=\"text-decoration:underline; color:var(--fg);\">Jadilah yang pertama →</a>
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = list.map((m, i) => `
    <tr data-testid=\"member-row-${i}\">
      <td>
        <div class=\"member-name\">
          <span class=\"avatar\">${escapeHtml(initials(m.name))}</span>
          <span>${escapeHtml(m.name)}</span>
        </div>
      </td>
      <td style=\"color: var(--fg-muted); font-family: 'JetBrains Mono', monospace; font-size: 13px;\">${escapeHtml(m.email)}</td>
      <td><span class=\"tag\">${escapeHtml(m.field)}</span></td>
    </tr>
  `).join('');
}

// --- Toast helper (used across pages) ---
function showToast(title, body, ms = 3500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('.toast-title').textContent = title;
  t.querySelector('.toast-body').textContent = body;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), ms);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initReveal();
  renderMembers();

  // Update year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});