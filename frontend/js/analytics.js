async function loadAnalytics() {
  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) {
      throw new Error('Analytics unavailable');
    }

    const data = await response.json();

    document.getElementById('dataset-size').textContent = data.dataset_size || '0';
    document.getElementById('training-records').textContent = data.training_records || '0';
    document.getElementById('testing-records').textContent = data.testing_records || '0';
    document.getElementById('locations-count').textContent = data.locations || '0';
    document.getElementById('feature-count').textContent = data.features || '0';
    document.getElementById('best-model').textContent = data.best_model || 'N/A';
    document.getElementById('r2-score').textContent = Number(data.best_r2 || 0).toFixed(4);
    document.getElementById('mae-score').textContent = Number(data.mae || 0).toFixed(2);
    document.getElementById('rmse-score').textContent = Number(data.rmse || 0).toFixed(2);

    renderModelComparison(data.model_comparison || []);
    renderActualVsPredicted(data.actual_vs_predicted || { actual: [], predicted: [] });
    renderFeatureImportance(data.feature_importance || []);
    renderDistribution(data.house_price_distribution || { labels: [], values: [] });
    renderPriceVsSqft(data.price_vs_sqft || { sqft: [], price: [] });
  } catch (error) {
    console.error(error);
  }
}

function renderModelComparison(items) {
  const labels = items.map((item) => item.label);
  const scores = items.map((item) => Number(item.r2 || 0));

  new Chart(document.getElementById('modelComparisonChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'R² Score',
        data: scores,
        backgroundColor: ['#4db6ff', '#59f3ff', '#7af5b6', '#ffd166'],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: false } },
    },
  });
}

function renderActualVsPredicted(values) {
  new Chart(document.getElementById('actualVsPredictedChart'), {
    type: 'line',
    data: {
      labels: values.actual.map((_, index) => index + 1),
      datasets: [
        { label: 'Actual', data: values.actual, borderColor: '#4db6ff', fill: false },
        { label: 'Predicted', data: values.predicted, borderColor: '#59f3ff', fill: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderFeatureImportance(items) {
  const sorted = [...items].sort((a, b) => Number(b.value) - Number(a.value)).slice(0, 8);
  new Chart(document.getElementById('featureImportanceChart'), {
    type: 'doughnut',
    data: {
      labels: sorted.map((item) => item.label),
      datasets: [{
        data: sorted.map((item) => Number(item.value || 0)),
        backgroundColor: ['#4db6ff', '#59f3ff', '#7af5b6', '#ffd166', '#90cdf4', '#a0f0ed', '#c7d2fe', '#f9a8d4'],
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function renderDistribution(values) {
  new Chart(document.getElementById('priceDistributionChart'), {
    type: 'pie',
    data: {
      labels: values.labels || ['Low', 'Mid', 'High'],
      datasets: [{
        data: values.values || [0, 0, 0],
        backgroundColor: ['#4db6ff', '#59f3ff', '#7af5b6'],
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function renderPriceVsSqft(values) {
  new Chart(document.getElementById('priceVsSqftChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Price vs Sqft',
        data: (values.sqft || []).map((value, index) => ({ x: Number(value), y: Number((values.price || [])[index] || 0) })),
        backgroundColor: '#59f3ff',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Square Footage' } },
        y: { title: { display: true, text: 'Price' } },
      },
    },
  });
}

loadAnalytics();
