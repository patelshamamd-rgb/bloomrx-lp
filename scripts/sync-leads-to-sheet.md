# Sync here.now Site Data → Google Sheet

**Canonical sheet:** https://docs.google.com/spreadsheets/d/1k1wadPlwH1CUOXIXj3u0WXWDHElvmDyaBei78guqki8/edit  
**Shared writer:** shamapsychmd@gmail.com  
**Price:** $199/mo all-in  

## Realtime (preferred)
1. Open Google Sheet → Extensions → Apps Script  
2. Paste `apps-script/Code.gs` (SHEET_ID already set to canonical)  
3. Deploy → New deployment → Web app → Execute as Me → Anyone  
4. Paste `/exec` URL into `quiz.html` as `SHEET_WEBAPP_URL`  
5. Republish site

## Batch sync from Site Data
```bash
KEY=$(cat ~/.herenow/credentials)
curl -sS "https://here.now/api/v1/publishes/embercare/data/leads?limit=100" \
  -H "Authorization: Bearer $KEY" -H "X-HereNow-Client: cursor/embercare-funnel"
```
Then append rows into the Sheet (Apps Script `doPost`, or recreate CSV via Drive).
