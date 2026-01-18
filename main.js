/* main.js
 * Fetch ./data.json and render a responsive scatter plot using Chart.js
 * - No animations
 * - Axis labels set
 * - Robust to malformed entries
 */

async function initScatter() {
  const canvas = document.getElementById('scatterChart');
  if (!canvas) return;

  try {
    const res = await fetch('./data.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to fetch data.json: ${res.status}`);
    const raw = await res.json();

    const points = Array.isArray(raw)
      ? raw.map((p, i) => {
          const x = Number(p && p.x);
          const y = Number(p && p.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            console.warn(`Skipping invalid point at index ${i}:`, p);
            return null;
          }
          return { x, y };
        }).filter(Boolean)
      : [];

    renderChart(points);
  } catch (err) {
    console.error('Error loading data.json', err);
    // render empty chart so the page still shows a valid chart
    renderChart([]);
  }
}

let chartInstance = null;

function renderChart(points) {
  const canvas = document.getElementById('scatterChart');
  const ctx = canvas.getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Data',
          data: points,
          backgroundColor: 'rgba(33,150,243,0.85)',
          borderColor: 'rgba(33,150,243,1)',
          pointRadius: 4,
          showLine: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: { display: true, text: 'X' }
        },
        y: {
          title: { display: true, text: 'Y' }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initScatter);
