const form = document.getElementById('prediction-form');
const formMessage = document.getElementById('form-message');
const submitButton = document.querySelector('.submit-btn');
const resultPanel = document.getElementById('result-panel');
const estimatePrice = document.getElementById('estimated-price');
const locationSelect = document.getElementById('location');

function formatIndianPrice(value) {
  const safeValue = Number(value || 0);
  if (safeValue >= 10000000) {
    return `₹${(safeValue / 10000000).toFixed(2)} Crores`;
  }
  return `₹${(safeValue / 100000).toFixed(2)} Lakhs`;
}

async function loadLocations() {
  try {
    // Try fetching from backend API first (if available)
    let response = await fetch('/api/locations');
    if (!response.ok) {
      // Fallback to static file served with the frontend
      response = await fetch('/data/locations.json');
    }

    if (!response.ok) {
      throw new Error('Locations unavailable');
    }

    const data = await response.json();
    const locations = data.locations || [];
    locationSelect.innerHTML = '<option value="">Select location</option>' + locations.map((loc) => `<option value="${loc}">${loc}</option>`).join('');
  } catch (error) {
    console.error(error);
  }
}

async function populateModelInfo() {
  try {
    const response = await fetch('/api/model-info');
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const r2 = Number(data.best_r2 || 0).toFixed(4);
    document.getElementById('result-model').textContent = data.best_model || 'N/A';
    document.getElementById('result-r2').textContent = r2;
  } catch (error) {
    console.error(error);
  }
}

function setFormMessage(message, type = 'error') {
  formMessage.textContent = message;
  formMessage.classList.remove('hidden', 'error', 'success');
  formMessage.classList.add(type);
}

function showLoading(isLoading) {
  const buttonText = submitButton.querySelector('.btn-text');
  const loader = submitButton.querySelector('.loader');
  buttonText.textContent = isLoading ? 'Predicting...' : 'Predict House Price';
  loader.classList.toggle('hidden', !isLoading);
  submitButton.disabled = isLoading;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = {
    bedrooms: Number(formData.get('bedrooms')),
    sqft: Number(formData.get('sqft')),
    bathrooms: Number(formData.get('bathrooms')),
    location: formData.get('location'),
    property_age: Number(formData.get('property_age') || 10),
    parking: Number(formData.get('parking') || 1),
    stories: Number(formData.get('stories') || 1),
  };

  if (!payload.location) {
    setFormMessage('Please select a valid location.', 'error');
    return;
  }

  showLoading(true);
  formMessage.classList.add('hidden');

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Prediction failed');
    }

    estimatePrice.textContent = result.formatted_price || formatIndianPrice(result.predicted_price);
    document.getElementById('result-bedrooms').textContent = payload.bedrooms;
    document.getElementById('result-sqft').textContent = payload.sqft;
    document.getElementById('result-bathrooms').textContent = payload.bathrooms;
    document.getElementById('result-location').textContent = payload.location;
    document.getElementById('result-model').textContent = result.model_name || 'Best model';
    document.getElementById('result-r2').textContent = Number(result.model_r2 || 0).toFixed(4);

    resultPanel.classList.remove('hidden');
    setFormMessage('Prediction generated successfully.', 'success');
    formMessage.classList.remove('hidden');
  } catch (error) {
    setFormMessage(error.message || 'Something went wrong. Please try again.', 'error');
    formMessage.classList.remove('hidden');
  } finally {
    showLoading(false);
  }
});

document.getElementById('predict-again-btn').addEventListener('click', () => {
  resultPanel.classList.add('hidden');
  form.reset();
  setFormMessage('');
  formMessage.classList.add('hidden');
});

loadLocations();
populateModelInfo();
