/* ============================================
   Tech Community — Gallery Page Script
   ============================================ */

(function () {
  // Image carousel
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=1400&q=80',
      caption: 'Workshop kolaboratif — Jakarta'
    },
    {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
      caption: 'Sesi diskusi tentang produk dan riset'
    },
    {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80',
      caption: 'Coding sprint mingguan komunitas'
    },
    {
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80',
      caption: 'Hackathon malam — open source friendly'
    }
  ];

  let idx = 0;

  function update() {
    const frame = document.getElementById('image-frame');
    const img = document.getElementById('gallery-img');
    const counter = document.getElementById('image-counter');
    const caption = document.getElementById('image-caption');
    if (!img) return;

    frame.classList.add('fading');
    setTimeout(() => {
      img.src = images[idx].src;
      img.alt = images[idx].caption;
      if (caption) caption.textContent = images[idx].caption;
      if (counter) counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
      frame.classList.remove('fading');
    }, 280);
  }

  function next() { idx = (idx + 1) % images.length; update(); }
  function prev() { idx = (idx - 1 + images.length) % images.length; update(); }

  // Audio player
  function setupAudio() {
    const audio = document.getElementById('bg-audio');
    const player = document.getElementById('audio-player');
    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const iconPlay = document.getElementById('icon-play');
    if (!audio) return;

    function setPlaying(p) {
      if (p) {
        player.classList.add('playing');
        iconPlay.innerHTML = '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"6\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"/><rect x=\"14\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"/></svg>';
      } else {
        player.classList.remove('playing');
        iconPlay.innerHTML = '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M8 5v14l11-7z\"/></svg>';
      }
    }

    btnPlay?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {
          showToast('Audio gagal diputar', 'Browser memblokir autoplay. Coba klik tombol play sekali lagi.');
        });
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    btnStop?.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    });

    audio.addEventListener('ended', () => setPlaying(false));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-next')?.addEventListener('click', next);
    document.getElementById('btn-prev')?.addEventListener('click', prev);
    document.getElementById('btn-info')?.addEventListener('click', () => {
      showToast('Tentang Galeri', 'Koleksi momen kolaborasi & belajar bersama Tech Community.');
    });
    update();
    setupAudio();
  });
})();