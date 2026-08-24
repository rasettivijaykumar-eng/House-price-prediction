async function loadModelInfo() {
  try {
    const response = await fetch('/api/model-info');
    if (!response.ok) {
      throw new Error('Model info unavailable');
    }

    const data = await response.json();
    const bestR2 = Number(data.best_r2 || 0).toFixed(4);

    document.getElementById('stat-records').textContent = data.dataset_records || '0';
    document.getElementById('stat-locations').textContent = data.locations || '0';
    document.getElementById('stat-features').textContent = data.features || '0';
    document.getElementById('stat-r2').textContent = bestR2;
    document.getElementById('training-records').textContent = data.dataset_records || '0';
    document.getElementById('location-count').textContent = data.locations || '0';
    document.getElementById('feature-count').textContent = data.features || '0';
    document.getElementById('best-r2-value').textContent = bestR2;
    document.getElementById('model-label').textContent = data.best_model || 'N/A';
  } catch (error) {
    console.error(error);
  }
}

loadModelInfo();
