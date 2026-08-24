# 10 — Google Sheets Webhook (Apps Script) + CSV Template

Backend `POST /api/orders` and `POST /api/orders/{id}/upsell` send JSON to a Google Apps Script
webhook (`SHEETS_WEBHOOK_URL`). The script appends a row (or updates on upsell). No auth beyond the
deploy URL (treat URL as secret; restrict via Sheet sharing).

## 1. Apps Script code (paste in Extensions → Apps Script → deploy as Web App)

```javascript
// Warda Beauté — Orders Webhook
// Deploy: Execute as "Me", Who has access "Anyone". Copy the /exec URL into SHEETS_WEBHOOK_URL.

var SHEET_NAME = "Orders";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow(getHeaders());
    }

    // Upsell update: if order_id exists, append note instead of new row
    if (data.type === "upsell") {
      var last = sheet.getLastRow();
      for (var r = 2; r <= last; r++) {
        if (sheet.getRange(r, 1).getValue() == data.order_id) {
          var note = sheet.getRange(r, 16).getValue();
          sheet.getRange(r, 16).setValue((note ? note + " | " : "") + "UPSELL +99 MAD");
          sheet.getRange(r, 14).setValue(data.total); // total col
          return json({ ok: true, updated: data.order_id });
        }
      }
      return json({ ok: false, error: "order_not_found" });
    }

    // New order row
    sheet.appendRow([
      data.order_id,
      data.date,
      data.customer_name,
      data.phone,
      data.city,
      data.address,
      data.postal || "",
      JSON.stringify(data.items_json),
      data.subtotal,
      data.upsell ? 99 : 0,
      data.total,
      data.status,
      (data.country || "") + " | risk:" + (data.geo_risk || ""),
      data.ip,
      data.source || "web",
      data.notes || "",
      new Date().toISOString() // received_at
    ]);
    return json({ ok: true, id: data.order_id });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getHeaders() {
  return ["order_id","date","customer_name","phone","city","address","postal",
          "items_json","subtotal","upsell","total","status","geo","ip","source","notes","received_at"];
}
function json(o){ return ContentService.createTextOutput(JSON.stringify(o))
  .setMimeType(ContentService.MimeType.JSON); }
```

Notes:
- `items_json` is a JSON string of `[{slug,name,qty,unit_price,line_total}]`.
- For upsell, backend sends `{type:"upsell", order_id, total}` → script marks row + updates total.
- Deploy URL is secret; rotate by re-deploying if leaked.

## 2. CSV template (import to create the sheet, or use as column reference)
Save as `warda_orders_template.csv`:

```csv
order_id,date,customer_name,phone,city,address,postal,items_json,subtotal,upsell,total,status,geo,ip,source,notes,received_at
WB-0001,2026-01-01,Nadia B.,0661234567,Casablanca,"12 rue Allal, appt 3",20000,"[{""slug"":""velvastretch"",""name"":""VelvaStretch™"",""qty"":1,""unit_price"":279,""line_total"":279}]",279,0,279,pending,Morocco | risk:low,1.2.3.4,web,,2026-01-01T10:00:00Z
```

Columns (17): order_id, date, customer_name, phone, city, address, postal, items_json, subtotal,
upsell, total, status, geo, ip, source, notes, received_at.

## 3. Backend payload shape (`services/sheets.py`)
```python
payload = {
  "order_id": str(order.id)[:8].upper() or full uuid,
  "date": order.created_at.isoformat(),
  "customer_name": order.customer_name,
  "phone": order.phone,
  "city": order.city,
  "address": order.address,
  "postal": order.postal or "",
  "items_json": [{"slug":i.slug,"name":i.name,"qty":i.qty,
                  "unit_price":i.unit_price,"line_total":i.line_total} for i in items],
  "subtotal": order.subtotal,
  "upsell": 99 if order.upsell_added else 0,
  "total": order.total,
  "status": order.status,
  "country": order.country,
  "geo_risk": order.geo_risk,
  "ip": order.ip,
  "source": "web",
  "notes": ""
}
# POST to SHEETS_WEBHOOK_URL with timeout=10s; log + ignore failures
```

## 4. Mapping to admin / delivery
- Delivery partner (Amana/Maystro) can be fed from this sheet via export or Zapier.
- Status column updated manually by operator: pending→confirmed→shipped→delivered→cancelled.
