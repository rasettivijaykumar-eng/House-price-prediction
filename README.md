# HomePrice AI – House Price Prediction System

## 1. Project Title
HomePrice AI – House Price Prediction System

## 2. Problem Statement
Design a supervised learning model to predict house prices based on features like number of bedrooms, square footage, and location.

## 3. Objectives
- Build a regression-based machine learning pipeline for house price prediction.
- Clean and prepare a real housing dataset for training.
- Train multiple regression models and compare their performance.
- Save the best pipeline and deploy it using Flask.
- Create a modern AI SaaS-style web application with prediction and analytics pages.

## 4. Features
- Real ML training workflow using pandas, NumPy, and scikit-learn.
- Data cleaning, duplicate removal, missing value handling, outlier clipping, and location normalization.
- One-hot encoding for categorical location values.
- Model comparison using Linear Regression, Decision Tree, Random Forest, and Gradient Boosting.
- Saved trained pipeline with Joblib.
- Flask REST API for prediction and analytics.
- Responsive frontend with landing page, prediction form, analytics dashboard, and about page.

## 5. Technology Stack
### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap-inspired modern custom CSS
- Chart.js

### Backend
- Python
- Flask
- REST API

### Machine Learning
- Pandas
- NumPy
- Scikit-learn
- Matplotlib
- Seaborn
- Joblib

## 6. Dataset Description
The project expects a CSV dataset with at least:
- location
- bedrooms/BHK
- sqft
- bathrooms
- price

Additional useful fields such as property age, parking, and stories are also supported.

## 7. Machine Learning Workflow
1. Load the dataset.
2. Display shape and column information.
3. Check missing values.
4. Remove duplicates.
5. Clean numeric columns.
6. Clean and normalize locations.
7. Handle missing values.
8. Encode categorical location values using One-Hot Encoding.
9. Detect and clip important outliers.
10. Perform exploratory data analysis.
11. Select useful features.
12. Train/test split with fixed random_state.
13. Train regression models.
14. Evaluate metrics.
15. Save the best pipeline and metadata.
16. Use the trained model for prediction.

## 8. Algorithms Used
- Linear Regression
- Decision Tree Regressor
- Random Forest Regressor
- Gradient Boosting Regressor

## 9. Evaluation Metrics
- MAE
- MSE
- RMSE
- R² Score

## 10. Installation Instructions
1. Clone or download the project.
2. Open a terminal in the project root.
3. Create and activate a Python environment if preferred.
4. Install dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

## 11. How to Train the Model
From the project root:

```bash
python backend/train_model.py
```

This reads the CSV from the dataset folder, trains all models, evaluates them, selects the best one, and saves:
- model/house_price_model.pkl
- model/model_metadata.json

## 12. How to Start Flask
From the project root:

```bash
python backend/app.py
```

Then open:
- http://localhost:5000/

## 13. How to Use the Website
1. Open the landing page.
2. Click Predict House Price.
3. Enter bedrooms, square footage, bathrooms, and location.
4. Submit the form.
5. View the predicted property price and model details.
6. Explore the analytics dashboard and about page.

## 14. Deploy Backend to Render and Frontend to Vercel

The project is arranged as two services:

- Render runs the Flask API and trains the model during its build.
- Vercel serves the static files in `frontend/`.

### Deploy the backend to Render

1. Push this repository to GitHub, including `dataset/house_prices.csv`.
2. In Render, choose **New > Blueprint** and select the repository. Render will read `render.yaml`.
3. After the service is created, copy its public URL, for example `https://homeprice-ai-api.onrender.com`.
4. Open the Render service environment variables and set `FRONTEND_ORIGIN` to the final Vercel URL, for example `https://homeprice-ai.vercel.app`. Multiple origins can be separated by commas.
5. Check `https://YOUR-RENDER-URL.onrender.com/health`. It should return `{"status":"ok"}`.

The Render build command installs `backend/requirements.txt` and runs `python -m backend.train_model`, so the ignored model file is generated on the server.

### Deploy the frontend to Vercel

1. Before deploying, edit `frontend/js/config.js` and set `HOMEPRICE_API_URL` to the Render URL:

```js
window.HOMEPRICE_API_URL = 'https://YOUR-RENDER-URL.onrender.com';
```

2. In Vercel, choose **Add New > Project**, import the same repository, and leave the project root as the repository root. The existing `vercel.json` routes the static site from `frontend/`.
3. Deploy the project and copy its Vercel URL.
4. Add that Vercel URL to Render's `FRONTEND_ORIGIN` variable and redeploy the backend.
5. Test `/`, `/predict`, `/analytics`, a prediction submission, and the analytics charts on the Vercel URL.

For local development, leave `HOMEPRICE_API_URL` empty and start Flask with `python backend/app.py`; the frontend will use the local API origin.

## 15. Project Structure
```text
homeprice-ai/
├── dataset/
│   └── house_prices.csv
├── notebooks/
│   └── house_price_analysis.ipynb
├── model/
│   ├── house_price_model.pkl
│   └── model_metadata.json
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── preprocess.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── predict.html
│   ├── analytics.html
│   ├── about.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── predict.js
│       └── analytics.js
├── README.md
└── .gitignore
```

## 16. Results
The model is trained from the provided dataset and the best-performing regression model is selected automatically based on the highest R² score. The app displays the actual ML-generated prediction values from that model.

## 17. Limitations
- Model predictions are estimates and not official valuations.
- Performance depends on dataset quality and feature completeness.
- A small or biased dataset may lead to limited generalization.

## 18. Future Scope
- Add user authentication and saved history.
- Support uploading custom CSV files for retraining.
- Add more advanced models and hyperparameter tuning.
- Deploy to a cloud platform.

## Disclaimer
Predicted values are estimates generated by a machine learning model and should not be considered professional property valuation.
