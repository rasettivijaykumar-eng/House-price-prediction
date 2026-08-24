import json
from pathlib import Path

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATASET_PATH = PROJECT_ROOT / "dataset" / "house_prices.csv"
MODEL_DIR = PROJECT_ROOT / "model"
MODEL_PATH = MODEL_DIR / "house_price_model.pkl"
METADATA_PATH = MODEL_DIR / "model_metadata.json"


NUMERIC_COLUMNS = [
    "bedrooms",
    "sqft",
    "bathrooms",
    "property_age",
    "parking",
    "stories",
]
CATEGORICAL_COLUMNS = ["location"]
TARGET_COLUMN = "price"
FEATURE_COLUMNS = NUMERIC_COLUMNS + CATEGORICAL_COLUMNS


def normalize_location(value):
    if pd.isna(value):
        return "Unknown"
    return str(value).strip().replace("  ", " ").title()


def clean_dataset(df):
    df = df.copy()
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    df = df.drop_duplicates().reset_index(drop=True)

    for col in ["property_age", "parking", "stories"]:
        if col not in df.columns:
            df[col] = 0

    required_columns = {"location", "bedrooms", "sqft", "bathrooms", "price"}
    missing_required = required_columns - set(df.columns)
    if missing_required:
        raise ValueError(f"Dataset is missing required columns: {sorted(missing_required)}")

    for col in NUMERIC_COLUMNS + [TARGET_COLUMN]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["location"] = df["location"].map(normalize_location)
    df = df.dropna(subset=["location", "bedrooms", "sqft", "bathrooms", TARGET_COLUMN])

    for col in ["bedrooms", "sqft", "bathrooms", "property_age", "parking", "stories"]:
        if col in df.columns:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            df[col] = df[col].clip(lower=lower, upper=upper)

    df[TARGET_COLUMN] = df[TARGET_COLUMN].clip(lower=0)
    df["location"] = df["location"].replace("", "Unknown")
    df["location"] = df["location"].fillna("Unknown")

    return df


def build_preprocessor():
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median"))
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_COLUMNS),
            ("cat", categorical_transformer, CATEGORICAL_COLUMNS),
        ],
        remainder="drop",
    )

    return preprocessor


def get_train_test_data(csv_path=DATASET_PATH):
    df = pd.read_csv(csv_path)
    cleaned_df = clean_dataset(df)

    X = cleaned_df[FEATURE_COLUMNS]
    y = cleaned_df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    return X_train, X_test, y_train, y_test, cleaned_df


def save_metadata(metadata):
    MODEL_DIR.mkdir(exist_ok=True, parents=True)
    with open(METADATA_PATH, "w", encoding="utf-8") as handle:
        json.dump(metadata, handle, indent=2)


def load_metadata():
    if not METADATA_PATH.exists():
        return {}
    with open(METADATA_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


if __name__ == "__main__":
    df = pd.read_csv(DATASET_PATH)
    cleaned = clean_dataset(df)
    print(cleaned.head())
    print(cleaned.shape)
    print(cleaned.isna().sum())
