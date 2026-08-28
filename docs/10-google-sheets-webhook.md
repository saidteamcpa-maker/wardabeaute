# 10 — Google Sheets Webhook (Apps Script) + CSV Template

Backend `POST /api/orders` and `POST /api/orders/{id}/upsell` send JSON to a Google Apps Script
webhook (`SHEETS_WEBHOOK_URL`). The script appends a row (or updates on upsell). No auth beyond the
deploy URL (treat URL as secret; restrict via Sheet sharing).

## 1. Apps Script code (paste in Extensions → Apps Script → deploy as Web App)

```javascript
function doGet(e){ return json({ok:true, msg:"Warda Sheets webhook: use POST"}); }

function doPost(e) {
  try {
    if(!e.postData || !e.postData.contents) throw new Error("No POST body received");
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById("1-6W11vKEODIuEHT9lGqA9JBNE26zQE0O1BF12jRQ9IM");
    var sheet = ss.getSheetByName("warda beaute - orders") || ss.insertSheet("warda beaute - orders");
    if(sheet.getLastRow()===0) sheet.appendRow(["date_order","full_name","phone","address","sku","qte","price","note","delivery_note"]);
    if(data.type==="upsell"){
      var last = sheet.getLastRow();
      for(var r = 2; r <= last; r++){
        var noteVal = String(sheet.getRange(r, 8).getValue() || "");
        if(noteVal.indexOf(data.order_id) !== -1){
          sheet.getRange(r, 8).setValue(noteVal + " | UPSELL +99 MAD");
          sheet.getRange(r, 7).setValue(data.total);
          SpreadsheetApp.flush();
          return json({ ok: true, updated: data.order_id });
        }
      }
      return json({ ok: false, error: "order_not_found" });
    }
    var items=data.items_json||[]; var skus=[]; var totalQty=0;
    for(var i=0;i<items.length;i++){ skus.push(items[i].sku || items[i].slug || ""); totalQty+=items[i].qty||1; }

    var dateStr=""; if(data.date){ var d=new Date(data.date); dateStr=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+(("0"+d.getMinutes()).slice(-2)); }
    var address=[data.city, data.address].filter(Boolean).join(", ");
    var note=data.order_id||""; if(data.discount) note+=" | Bundle -"+data.discount+" MAD"; if(data.notes) note+=" | "+data.notes;
    sheet.appendRow([dateStr, data.customer_name||"", data.phone||"", address, skus.join(" / "), totalQty, data.total||0, note, ""]);
    SpreadsheetApp.flush();
    return json({ok:true, id:data.order_id});
  } catch(err){ return json({ok:false, error:String(err)}); }
}
function json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
```

## 2. Setup steps

### Step 1 — Create the Apps Script
1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Paste the code above
5. Click **Save** (Ctrl+S)

### Step 2 — Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Description: `Warda Orders Webhook`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**
7. **Copy the /exec URL** (looks like `https://script.google.com/macros/s/AKfyc.../exec`)

### Step 3 — Set the webhook URL on VPS
1. Go to EasyPanel → your `wardastore` (backend) service
2. Open **Environment** tab
3. Add variable: `SHEETS_WEBHOOK_URL` = *(paste the /exec URL)*
4. Click **Save** — backend restarts automatically

### Step 4 — Test
Place a test order (or use the whitelist phone `0666666666`). Check your Google Sheet — a new row should appear.

## 3. Column mapping

| Column | Source | Example |
|---|---|---|
| `date_order` | `order.created_at` formatted as `YYYY-MM-DD HH:MM` | `2026-08-27 14:30` |
| `full_name` | `customer_name` | `Fatima Zahra` |
| `phone` | `phone` | `0661234567` |
| `address` | `city` + `address` combined | `Casablanca, 12 rue Allal` |
| `sku` | Per line: `<qty> x <SKU>` from admin Products `sku` field (fallback to slug), joined by ` / ` | `2 x WVE-001 / 1 x CGL-001` (or `2 x velvastretch / 1 x collaglow` if SKU empty) |
| `qte` | Sum of all item quantities | `2` |
| `price` | Final total (after discount) | `549` |
| `note` | Order ID + discount info | `WB-xxx \| Bundle -49 MAD` |
| `delivery_note` | Empty (manual field) | |

## 4. Backend payload shape (`services/sheets.py`)
```python
payload = {
  "order_id": order.reference,           # e.g. "WB-1724784000000-A3F2B1C9"
  "date": order.created_at.isoformat(),  # ISO 8601
  "customer_name": order.customer_name,
  "phone": order.phone,
  "city": order.city,
  "address": order.address or "",
  "postal": order.postal or "",
  "items_json": [{"slug":i.slug,"sku":i.sku,"name":i.name,"qty":i.qty,
                  "unit_price":i.unit_price,"line_total":i.line_total} for i in items],
  "subtotal": subtotal,
  "discount": discount,                  # 49 for bundle, 0 otherwise
  "upsell": 0,                           # 99 after upsell
  "total": total,
  "status": order.status,
  "country": order.country,
  "geo_risk": order.geo_risk,
  "ip": ip,
  "source": "web",
  "notes": ""
}
# POST to SHEETS_WEBHOOK_URL with timeout=10s; log + ignore failures
```

## 5. Notes
- `items_json` is normally a **single consolidated object** whose `sku` is already formatted repo-side as `<qty>x<SKU>` joined by ` / ` (e.g. `2xWVE-001 / 1xCGL-001`), and `qty` is the total quantity. The Apps Script writes `items[i].sku` straight into the `sku` column and sums `qty` → `qte` column. (If you prefer per-line items, send `[{slug, sku, qty, ...}]` and the script falls back to formatting each line — but the consolidated form is what the backend/frontend currently send so no Apps Script redeploy is required.)
- For upsell, backend sends `{type:"upsell", order_id, total}` → script finds row by order_id in note and updates.
- Deploy URL is secret; rotate by re-deploying if leaked.
- Failures are silent — orders always succeed even if Sheets is down.
