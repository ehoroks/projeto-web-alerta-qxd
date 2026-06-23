// =============================
//  ALERTA QUIXADÁ — storage.js
// =============================

var SUPABASE_URL = 'https://oqeicsbbftwezsankhcw.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZWljc2JiZnR3ZXpzYW5raGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzg5OTUsImV4cCI6MjA5Nzc1NDk5NX0.IfQ1sYwetxEV5F4RASdWF-RJqPXEdk8C9bLWa9RB9Io';

function cabecalhos() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY
  };
}

function carregarRelatos(callback) {
  fetch(SUPABASE_URL + '/rest/v1/relatos?select=*&order=criado_em.desc', {
    headers: cabecalhos()
  })
  .then(function(res) { return res.json(); })
  .then(function(data) { callback(data); })
  .catch(function(err) { console.error('Erro ao carregar relatos:', err); callback([]); });
}

function salvarRelato(relato, callback) {
  fetch(SUPABASE_URL + '/rest/v1/relatos', {
    method: 'POST',
    headers: cabecalhos(),
    body: JSON.stringify({
      tipo:      relato.tipo,
      descricao: relato.descricao,
      lat:       relato.lat,
      lng:       relato.lng,
      data:      relato.data
    })
  })
  .then(function(res) {
    if (res.ok) { callback(true); }
    else { callback(false); }
  })
  .catch(function() { callback(false); });
}