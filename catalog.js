// LIST + DETAIL: данные берутся из data.json (как на уроке)
const DATA_URL = 'data.json';
let seriesData = [];

const grid = document.getElementById('series-grid');
const detailSection = document.getElementById('detail-section');
const detailCard = document.getElementById('detail-card');

async function loadSeries() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    seriesData = await response.json();
    renderSeriesList(seriesData);
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="load-error">Не удалось загрузить data.json. ' +
      'Откройте сайт через Live Server (правый клик по index.html → Open with Live Server).</p>';
  }
}

// LIST: карточки сериалов
function renderSeriesList(list) {
  grid.innerHTML = '';
  list.forEach(function (s) {
    const card = document.createElement('article');
    card.className = 'card clickable';
    card.innerHTML =
      '<div class="poster has-img">' +
        '<img src="' + s.image + '" alt="' + s.name + '" loading="lazy">' +
        '<span class="chip">★ ' + s.rating.toFixed(1) + '</span>' +
        '<strong>' + s.name + '</strong>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="meta">' + s.years + ' · ' + s.genre + '</div>' +
        '<h3>' + s.name + '</h3>' +
        '<p>' + s.description + '</p>' +
        '<span class="read">Подробнее →</span>' +
      '</div>';
    card.addEventListener('click', function () { showSeriesDetail(s.id); });
    grid.appendChild(card);
  });
}

// DETAIL: модальное окно
function showSeriesDetail(id) {
  const s = seriesData.find(function (item) { return item.id === id; });
  if (!s) return;
  const specs = Object.entries(s.specs).map(function (pair) {
    return '<li><span>' + pair[0] + '</span><b>' + pair[1] + '</b></li>';
  }).join('');
  detailCard.innerHTML =
    '<img class="detail-img" src="' + s.image + '" alt="' + s.name + '">' +
    '<div class="detail-info">' +
      '<div class="meta">' + s.years + ' · ' + s.genre + '</div>' +
      '<h2>' + s.name + '</h2>' +
      '<div class="rating"><span class="star">★</span><b>' + s.rating.toFixed(1) + '</b><small>/ 10 · IMDb</small></div>' +
      '<p>' + s.about + '</p>' +
      '<ul class="specs">' + specs + '</ul>' +
      '<a class="btn" href="' + s.page + '">Открыть страницу сериала →</a>' +
    '</div>';
  detailSection.classList.remove('hidden');
}

function closeDetail() { detailSection.classList.add('hidden'); }
document.getElementById('close-btn').addEventListener('click', closeDetail);
detailSection.addEventListener('click', function (e) { if (e.target === detailSection) closeDetail(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDetail(); });

document.addEventListener('DOMContentLoaded', loadSeries);