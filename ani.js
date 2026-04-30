const serviceCache = {
  wuthering_waves: [],
  genshin_impact: [],
};

const fallbackServices = {
  wuthering_waves: [
    {
      nama_layanan: 'Tower of Adversity',
      deskripsi: 'Clear semua floor Tower of Adversity dengan 3 stars',
      harga_min: 60000,
      harga_max: 180000,
      satuan: 'per completion',
    },
    {
      nama_layanan: 'Whimpering Waste',
      deskripsi: 'Clear Whimpering Waste dungeon dengan reward maksimal',
      harga_min: 40000,
      harga_max: 120000,
      satuan: 'per sesi',
    },
    {
      nama_layanan: 'Eksplorasi Map',
      deskripsi: 'Eksplorasi dungeon dan area hingga 100% completion',
      harga_min: 50000,
      harga_max: 150000,
      satuan: 'per area',
    },
    {
      nama_layanan: 'Imaginarium Theatre',
      deskripsi: 'Clear Imaginarium Theatre stage dengan score tinggi',
      harga_min: 45000,
      harga_max: 140000,
      satuan: 'per stage',
    },
    {
      nama_layanan: 'Level Up Union Level',
      deskripsi: 'Naik Union Level dengan cepat dan aman',
      harga_min: 25000,
      harga_max: 100000,
      satuan: 'per 5 level',
    },
    {
      nama_layanan: 'Farming Material',
      deskripsi: 'Farming ascension material resonator & weapon',
      harga_min: 35000,
      harga_max: 100000,
      satuan: 'per sesi',
    },
    {
      nama_layanan: 'Grinding Resonator',
      deskripsi: 'Level up resonator dengan ascension material',
      harga_min: 20000,
      harga_max: 80000,
      satuan: 'per resonator',
    },
    {
      nama_layanan: 'Daily Commission & Quest',
      deskripsi: 'Selesaikan daily mission & story quest',
      harga_min: 80000,
      harga_max: 180000,
      satuan: 'per bulan',
    },
  ],
  genshin_impact: [
    {
      nama_layanan: 'Spiral Abyss 12/12',
      deskripsi: 'Clear Spiral Abyss 12/12 dengan 3 stars semua floor',
      harga_min: 85000,
      harga_max: 250000,
      satuan: 'per cycle',
    },
    {
      nama_layanan: 'Level Up Adventure Rank',
      deskripsi: 'Naik Adventure Rank dengan cepat dan aman',
      harga_min: 30000,
      harga_max: 200000,
      satuan: 'per 5 AR',
    },
    {
      nama_layanan: 'Farming Artifact Domain',
      deskripsi: 'Farming artifact berkualitas tinggi dari domain',
      harga_min: 40000,
      harga_max: 150000,
      satuan: 'per sesi',
    },
    {
      nama_layanan: 'Farming Material & Talent Book',
      deskripsi: 'Farming material ascension & talent book karakter',
      harga_min: 35000,
      harga_max: 120000,
      satuan: 'per sesi',
    },
    {
      nama_layanan: 'Archon Quest & World Quest',
      deskripsi: 'Selesaikan Archon quest dan world quest cerita',
      harga_min: 45000,
      harga_max: 140000,
      satuan: 'per quest',
    },
    {
      nama_layanan: 'Abyss Specific Floor',
      deskripsi: 'Clear floor tertentu di Spiral Abyss dengan 3 stars',
      harga_min: 30000,
      harga_max: 90000,
      satuan: 'per 2 floor',
    },
    {
      nama_layanan: 'Character Level Up',
      deskripsi: 'Level up karakter dengan ascension material',
      harga_min: 50000,
      harga_max: 180000,
      satuan: 'per karakter',
    },
    {
      nama_layanan: 'Daily Commission 30 Hari',
      deskripsi: 'Selesaikan daily commission selama 30 hari',
      harga_min: 120000,
      harga_max: 280000,
      satuan: 'per bulan',
    },
  ],
};

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function setActiveGameCard(game) {
  const cards = document.querySelectorAll('.game-card');
  cards.forEach((card) => {
    const isWw = card.id === 'card-ww';
    const isGi = card.id === 'card-gi';
    card.classList.toggle('active', (game === 'wuthering_waves' && isWw) || (game === 'genshin_impact' && isGi));
  });

  const radios = document.querySelectorAll('input[name="game"]');
  radios.forEach((input) => {
    input.checked = input.value === game;
  });
}

function selectGame(game) {
  setActiveGameCard(game);
  onGameChange(game);
}

function onGameChange(game) {
  loadServices(game);
}

function loadServices(game, button = null) {
  if (button) {
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
  }

  const grid = document.getElementById('serviceGrid');
  const select = document.getElementById('layanan');

  grid.innerHTML = '<div class="loading-services">Memuat layanan...</div>';
  select.innerHTML = '<option value="">— Pilih layanan —</option>';
  document.getElementById('priceEstimate').style.display = 'none';

  if (serviceCache[game] && serviceCache[game].length > 0) {
    renderServices(game);
    return;
  }

  fetch(`services.php?game=${encodeURIComponent(game)}`)
    .then(async (response) => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.message || `Server mengembalikan status ${response.status}`);
        }
        return data;
      } catch (err) {
        const errorText = text.replace(/<[^>]+>/g, ' ').trim().substring(0, 120);
        throw new Error(errorText || 'Respons server tidak valid.');
      }
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || 'Gagal memuat layanan');
      }
      serviceCache[game] = Array.isArray(data.data) ? data.data : [];
      renderServices(game);
    })
    .catch(() => {
      const fallback = fallbackServices[game] || [];
      if (fallback.length) {
        serviceCache[game] = fallback;
        renderServices(game);
      } else {
        grid.innerHTML = '<div class="loading-services">Tidak dapat memuat layanan.</div>';
      }
    });
}

function renderServices(game) {
  const services = serviceCache[game] || [];
  const grid = document.getElementById('serviceGrid');
  const radioGroup = document.getElementById('serviceRadioGroup');
  const hiddenInput = document.getElementById('layanan');

  if (!services.length) {
    grid.innerHTML = '<div class="loading-services">Layanan tidak tersedia.</div>';
    radioGroup.innerHTML = '<div class="loading-services" style="grid-column: 1 / -1;">Layanan tidak tersedia.</div>';
    return;
  }

  const radioCards = services.map((service, idx) => {
    const escapedName = service.nama_layanan.replace(/'/g, "\\'");
    const escapedDesc = service.deskripsi.replace(/'/g, "\\'");
    const isFirst = idx === 0;
    
    return `
      <label class="service-radio-card ${isFirst ? 'active' : ''}" onclick="selectServiceRadio(this, '${escapedName}', '${escapedDesc}', ${service.harga_min}, ${service.harga_max}, '${service.satuan}', '${game}')">
        <input type="radio" name="layanan-radio" value="${service.nama_layanan}" ${isFirst ? 'checked' : ''} />
        <div class="service-radio-content">
          <strong>${service.nama_layanan}</strong>
          <p>${service.deskripsi}</p>
          <div class="price-info">
            <span class="price-range">${formatRupiah(service.harga_min)} - ${formatRupiah(service.harga_max)}</span>
            <span class="price-unit">${service.satuan}</span>
          </div>
        </div>
      </label>`;
  });

  radioGroup.innerHTML = radioCards.join('');
  if (services.length > 0) {
    hiddenInput.value = services[0].nama_layanan;
    updateServiceDetail(services[0].nama_layanan, services[0].deskripsi, services[0].harga_min, services[0].harga_max, services[0].satuan);
  }

  const cards = services.map((service) => {
    const escapedName = service.nama_layanan.replace(/'/g, "\\'");

    return `
      <div class="service-card" onclick="selectServiceFromCard('${escapedName}', '${game}')">
        <h4>${service.nama_layanan}</h4>
        <p>${service.deskripsi || service.satuan || 'Deskripsi layanan belum tersedia.'}</p>
        <div class="service-price">
          <div class="price-val ${game === 'genshin_impact' ? 'gi-price' : ''}">${formatRupiah(service.harga_min)} - ${formatRupiah(service.harga_max)}</div>
          <span class="price-sat">${service.satuan}</span>
        </div>
      </div>`;
  });

  grid.innerHTML = cards.join('');
}

function selectServiceFromCard(serviceName, selectedGame) {
  const select = document.getElementById('layanan');
  select.value = serviceName;
  onServiceChange(select);
  const activeTab = document.querySelector(`.tab-btn${selectedGame === 'wuthering_waves' ? ':first-child' : ':last-child'}`);
  if (activeTab) {
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.toggle('active', btn === activeTab));
  }
}

function onServiceChange(select) {
  const selected = select.options[select.selectedIndex];
  const estimateBox = document.getElementById('priceEstimate');
  const priceRange = document.getElementById('priceRange');
  const serviceDetail = document.getElementById('serviceDetail');

  if (!selected || !selected.value) {
    estimateBox.style.display = 'none';
    serviceDetail.style.display = 'none';
    priceRange.textContent = '—';
    return;
  }

  const min = Number(selected.dataset.min) || 0;
  const max = Number(selected.dataset.max) || 0;
  const unit = selected.dataset.unit || '';
  const deskripsi = selected.dataset.deskripsi || '';

  if (!min || !max) {
    priceRange.textContent = 'Estimasi harga tidak tersedia';
  } else {
    priceRange.textContent = `${formatRupiah(min)} - ${formatRupiah(max)} / ${unit}`;
  }

  if (deskripsi) {
    serviceDetail.innerHTML = `<strong>${selected.value}</strong><br/>${deskripsi}`;
    serviceDetail.style.display = 'block';
  } else {
    serviceDetail.style.display = 'none';
  }

  estimateBox.style.display = 'flex';
}

function selectServiceRadio(label, serviceName, deskripsi, hargaMin, hargaMax, satuan, game) {
  const radioGroup = document.getElementById('serviceRadioGroup');
  const hiddenInput = document.getElementById('layanan');
  
  radioGroup.querySelectorAll('.service-radio-card').forEach(card => card.classList.remove('active'));
  label.classList.add('active');
  label.querySelector('input[type="radio"]').checked = true;
  
  hiddenInput.value = serviceName;
  updateServiceDetail(serviceName, deskripsi, hargaMin, hargaMax, satuan);
}

function updateServiceDetail(serviceName, deskripsi, hargaMin, hargaMax, satuan) {
  const estimateBox = document.getElementById('priceEstimate');
  const priceRange = document.getElementById('priceRange');
  const serviceDetail = document.getElementById('serviceDetail');
  
  priceRange.textContent = `${formatRupiah(hargaMin)} - ${formatRupiah(hargaMax)} / ${satuan}`;
  serviceDetail.innerHTML = `<strong>${serviceName}</strong><br/>${deskripsi}`;
  serviceDetail.style.display = 'block';
  estimateBox.style.display = 'flex';
}

function getSelectedServicePrice() {
  const hiddenInput = document.getElementById('layanan');
  const serviceName = hiddenInput.value.trim();
  
  if (!serviceName) {
    return null;
  }

  const game = document.querySelector('input[name="game"]:checked').value;
  const services = serviceCache[game] || fallbackServices[game] || [];
  const service = services.find(s => s.nama_layanan === serviceName);
  
  if (!service) {
    return null;
  }

  const min = Number(service.harga_min) || 0;
  const max = Number(service.harga_max) || 0;
  if (!min && !max) {
    return null;
  }

  return max ? Math.round((min + max) / 2) : min;
}

function submitOrder(event) {
  event.preventDefault();
  const form = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitBtn');
  const harga = getSelectedServicePrice();

  if (harga === null) {
    showToast('Silakan pilih layanan sebelum mengirim pesanan.', 'error');
    return;
  }

  const payload = {
    nama_pelanggan: form.nama_pelanggan.value.trim(),
    whatsapp: form.whatsapp.value.trim(),
    game: form.game.value,
    layanan: form.layanan.value,
    target: form.target.value.trim(),
    server: form.server.value,
    akun_game: form.akun_game.value.trim(),
    password_game: form.password_game.value,
    catatan: form.catatan.value.trim(),
    harga,
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Mengirim...';

  fetch('kirim_pesanan.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.message || `Server mengembalikan status ${response.status}`);
        }
        return data;
      } catch (err) {
        const errorText = text.replace(/<[^>]+>/g, ' ').trim().substring(0, 120);
        throw new Error(errorText || 'Respons server tidak valid.');
      }
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || 'Gagal mengirim pesanan.');
      }

      showToast(data.message, 'success');
      form.reset();
      document.getElementById('priceEstimate').style.display = 'none';
      setActiveGameCard(payload.game);
      loadServices(payload.game);
    })
    .catch((error) => {
      showToast(error.message, 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Kirim Pesanan</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    });
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  if (item) {
    item.classList.toggle('open');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 10}s`;
    particle.style.animationDelay = `${-Math.random() * 10}s`;
    particle.style.opacity = `${0.2 + Math.random() * 0.6}`;
    container.appendChild(particle);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  setActiveGameCard('wuthering_waves');
  const defaultTab = document.querySelector('.tab-btn.active') || document.querySelector('.tab-btn');
  loadServices('wuthering_waves', defaultTab);
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', submitOrder);
  }
});