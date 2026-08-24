import csv
import json
from pathlib import Path

DATASET = Path(__file__).resolve().parents[1] / 'dataset' / 'house_prices.csv'
OUT = Path(__file__).resolve().parents[1] / 'frontend' / 'data' / 'locations.json'

OUT.parent.mkdir(parents=True, exist_ok=True)

locations = set()
with open(DATASET, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        loc = row.get('location')
        if loc:
            locations.add(loc.strip())

data = { 'locations': sorted(locations) }
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Wrote {len(data["locations"])} locations to {OUT}')
