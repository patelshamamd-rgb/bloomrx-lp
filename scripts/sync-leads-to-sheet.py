#!/usr/bin/env python3
"""Export here.now Site Data leads → CSV (upload to Drive as Google Sheet via MCP/create_file)."""
import csv, io, json, os, urllib.request
from pathlib import Path

SLUG = os.environ.get("BLOOMRX_HN_SLUG", "ivory-wreath-22bv")
API_KEY = Path.home().joinpath(".herenow/credentials").read_text().strip()
OUT = Path("/tmp/bloomrx-leads-export.csv")
COLS = [
  "timestamp","full_name","email","phone","state","age_band","goal","insurance_status",
  "bmi_est","glp1_history","contraindications","pace","lead_status","price",
  "answers_json","source_page","record_id","created_at"
]

req = urllib.request.Request(
  f"https://here.now/api/v1/publishes/{SLUG}/data/leads?limit=100",
  headers={"Authorization": f"Bearer {API_KEY}", "X-HereNow-Client": "cursor/bloomrx-funnel"},
)
with urllib.request.urlopen(req, timeout=60) as r:
  data = json.load(r)

buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=COLS, extrasaction="ignore")
w.writeheader()
for rec in data.get("records", []):
  row = dict(rec.get("data") or {})
  row["record_id"] = rec.get("id", "")
  row["created_at"] = rec.get("createdAt", "")
  w.writerow(row)
OUT.write_text(buf.getvalue())
print(f"Wrote {OUT} ({len(data.get('records', []))} leads)")
print("Upload CSV to Drive as Google Sheet (create_file text/csv) or open and copy into BloomRx Leads Sync.")
