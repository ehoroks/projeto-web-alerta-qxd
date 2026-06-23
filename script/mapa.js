// =============================
//  ALERTA QUIXADÁ — mapa.js
// =============================

var mapaPrincipal = null;
var marcadores = [];
var filtroAtivo = 'todos';

// ── ÍCONE DO MARCADOR ──
function criarIcone() {
  return L.divIcon({
    html: '<span style="font-size:2rem">📍</span>',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34]
  });
}

// ── RENDERIZA MARCADORES ──
function renderizarMarcadores() {
  for (var i = 0; i < marcadores.length; i++) {
    mapaPrincipal.removeLayer(marcadores[i]);
  }
  marcadores = [];

  carregarRelatos(function (relatos) {
    var filtrados = [];

    for (var i = 0; i < relatos.length; i++) {
      if (filtroAtivo === 'todos' || relatos[i].tipo === filtroAtivo) {
        filtrados.push(relatos[i]);
      }
    }

    document.getElementById('n-relatos').textContent = filtrados.length;

    for (var i = 0; i < filtrados.length; i++) {
      var r = filtrados[i];

      var popup =
        '<div class="popup-relato">' +
        '<strong>' + r.tipo + '</strong>' +
        '<p>' + (r.descricao || 'Sem descrição.') + '</p>' +
        '<p>' + r.data + '</p>' +
        '</div>';

      var m = L.marker([r.lat, r.lng], { icon: criarIcone() })
        .bindPopup(popup)
        .addTo(mapaPrincipal);

      marcadores.push(m);
    }
  });
}

// ── FILTROS ──
var botoes = document.querySelectorAll('#filtros button');

for (var i = 0; i < botoes.length; i++) {
  botoes[i].onclick = function () {
    for (var j = 0; j < botoes.length; j++) {
      botoes[j].classList.remove('ativo');
    }
    this.classList.add('ativo');
    filtroAtivo = this.getAttribute('data-filtro');
    renderizarMarcadores();
  };
}

// ── INIT ──
mapaPrincipal = L.map('mapa-principal', {
  maxBounds: BOUNDS_QUIXADA,
  maxBoundsViscosity: 1.0,
  minZoom: 13
}).setView([LAT_QUIXADA, LNG_QUIXADA], ZOOM_INICIAL);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(mapaPrincipal);

renderizarMarcadores();