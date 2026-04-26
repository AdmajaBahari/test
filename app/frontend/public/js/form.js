/* ============================================
   Tech Community — Form Page Script
   ============================================ */

(function () {
  function setError(name, msg) {
    const err = document.querySelector(`[data-error=\"${name}\"]`);
    if (err) err.textContent = msg || '';
  }

  function validate({ name, email, field }) {
    let ok = true;
    setError('name', ''); setError('email', ''); setError('field', '');
    if (!name || name.trim().length < 2) { setError('name', 'Nama minimal 2 karakter.'); ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Format email tidak valid.'); ok = false; }
    if (!field) { setError('field', 'Pilih bidang minat Anda.'); ok = false; }
    return ok;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: (fd.get('name') || '').toString().trim(),
        email: (fd.get('email') || '').toString().trim(),
        field: (fd.get('field') || '').toString().trim(),
      };
      if (!validate(data)) return;

      addMember({ ...data, joinedAt: new Date().toISOString() });

      // Show toast confirmation
      showToast(
        'Pendaftaran berhasil',
        `Selamat datang, ${data.name}! Data Anda telah tersimpan di Tech Community.`
      );

      form.reset();

      // Surface preview block under form
      const preview = document.getElementById('preview');
      if (preview) {
        preview.innerHTML = `
          <div class=\"mono\" style=\"color: var(--fg-subtle); margin-bottom: 14px;\">[ Data terkirim ]</div>
          <div style=\"display: grid; grid-template-columns: 1fr; gap: 14px;\">
            <div><span class=\"mono\" style=\"color:var(--fg-subtle); display:block; margin-bottom:4px;\">Nama</span><span style=\"font-family:'Instrument Serif',serif; font-size:24px;\">${data.name.replace(/[<>]/g,'')}</span></div>
            <div><span class=\"mono\" style=\"color:var(--fg-subtle); display:block; margin-bottom:4px;\">Email</span><span style=\"font-family:'JetBrains Mono',monospace; font-size:14px;\">${data.email.replace(/[<>]/g,'')}</span></div>
            <div><span class=\"mono\" style=\"color:var(--fg-subtle); display:block; margin-bottom:4px;\">Bidang</span><span class=\"tag\">${data.field.replace(/[<>]/g,'')}</span></div>
          </div>
          <a href=\"index.html\" class=\"btn btn-secondary\" data-testid=\"goto-home\" style=\"margin-top:28px;\">Lihat di daftar anggota <span class=\"arrow\">→</span></a>
        `;
        preview.style.opacity = '0';
        preview.style.transform = 'translateY(12px)';
        preview.style.display = 'block';
        requestAnimationFrame(() => {
          preview.style.transition = 'all .6s cubic-bezier(.2,.8,.2,1)';
          preview.style.opacity = '1';
          preview.style.transform = 'translateY(0)';
        });
      }
    });
  });
})();