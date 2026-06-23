// =============================
//  ALERTA QUIXADÁ — form.js
// =============================

var mapaForm = null;
var marcadorForm = null;
var coordSelecionada = null;

// ── MAPA ──
mapaForm = L.map('mapa-form', {
  maxBounds: BOUNDS_QUIXADA,
  maxBoundsViscosity: 1.0,
  minZoom: 13
}).setView([LAT_QUIXADA, LNG_QUIXADA], ZOOM_INICIAL);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(mapaForm);

mapaForm.on('click', function (e) {
  coordSelecionada = e.latlng;

  if (marcadorForm) {
    mapaForm.removeLayer(marcadorForm);
  }

  marcadorForm = L.marker(coordSelecionada).addTo(mapaForm);

  document.getElementById('coords-display').textContent =
    'Local marcado: ' + coordSelecionada.lat.toFixed(5) + ', ' + coordSelecionada.lng.toFixed(5);

  document.getElementById('erro-loc').classList.remove('visivel');
});

// ── VALIDAÇÃO ──
function validar() {
  var valido = true;

  if (!document.querySelector('input[name="tipo"]:checked')) {
    document.getElementById('erro-tipo').classList.add('visivel');
    valido = false;
  } else {
    document.getElementById('erro-tipo').classList.remove('visivel');
  }

  if (!coordSelecionada) {
    document.getElementById('erro-loc').classList.add('visivel');
    valido = false;
  } else {
    document.getElementById('erro-loc').classList.remove('visivel');
  }

  return valido;
}

// ── TOAST ──
function mostrarToast(msg, tipo) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'visivel';
  if (tipo) {
    toast.classList.add(tipo);
  }
  setTimeout(function () {
    toast.className = '';
  }, 3000);
}

// ── ENVIAR ──
document.getElementById('btn-enviar').onclick = function () {
  if (!validar()) {
    mostrarToast('Preencha todos os campos obrigatórios.', 'erro');
    return;
  }

  var relato = {
    tipo: document.querySelector('input[name="tipo"]:checked').value,
    descricao: document.getElementById('descricao').value.trim(),
    lat: coordSelecionada.lat,
    lng: coordSelecionada.lng,
    data: new Date().toLocaleDateString('pt-BR')
  };

  salvarRelato(relato, function (ok) {
    if (ok) {
      mostrarToast('Relato enviado com sucesso!', 'sucesso');
      document.querySelectorAll('input[type="radio"]').forEach(function (r) {
        r.checked = false;
      });
      document.getElementById('descricao').value = '';
      document.getElementById('coords-display').textContent = '';
      coordSelecionada = null;
      if (marcadorForm) {
        mapaForm.removeLayer(marcadorForm);
        marcadorForm = null;
      }
    } else {
      mostrarToast('Erro ao enviar. Tente novamente.', 'erro');
    }
  });
};

// limpa o formulário
document.querySelectorAll('input[type="radio"]').forEach(function (r) {
  r.checked = false;
});
document.getElementById('descricao').value = '';
document.getElementById('coords-display').textContent = '';
coordSelecionada = null;
if (marcadorForm) {
  mapaForm.removeLayer(marcadorForm);
  marcadorForm = null;
};