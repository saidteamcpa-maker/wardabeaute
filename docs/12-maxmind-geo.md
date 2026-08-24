# 12 — MaxMind Geo-Gating (Morocco only, block VPN, whitelist)

Orders allowed ONLY from Morocco IP, NOT VPN/proxy/Tor/suspicious — except whitelisted `0666666666`.

## 1. Setup
- Use **GeoLite2 City** (free) or **GeoIP2 City** (paid, better VPN detection). DB file:
  `GeoLite2-City.mmdb` mounted at `MAXMIND_DB_PATH` (`/app/geo/...`).
- Python: `pip install maxminddb`. Load once at startup:
  ```python
  import maxminddb
  reader = maxminddb.open_database(os.getenv("MAXMIND_DB_PATH"))
  ```

## 2. Lookup (`services/geo.py`)
```python
def lookup(ip: str) -> dict:
    if not ENABLED or reader is None:
        return {"country_iso": None, "is_morocco": True, "is_vpn": False,
                "is_proxy": False, "is_tor": False, "risk_score": 0, "degraded": True}
    try:
        r = reader.get(ip) or {}
    except Exception:
        return {"country_iso": None, "is_morocco": True, "is_vpn": False,
                "is_proxy": False, "is_tor": False, "risk_score": 0, "degraded": True}
    iso = (r.get("country") or r.get("registered_country") or {}).get("iso_code")
    traits = r.get("traits", {})
    # GeoIP2 adds: is_anonymous_proxy / is_vpn / is_tor_exit_node / is_public_proxy / is_residential_proxy
    is_vpn = bool(traits.get("is_vpn"))
    is_proxy = bool(traits.get("is_public_proxy") or traits.get("is_anonymous_proxy"))
    is_tor = bool(traits.get("is_tor_exit_node"))
    risk = sum([is_vpn, is_proxy, is_tor])  # 0..3
    return {
        "country_iso": iso,
        "country_name": (r.get("country") or {}).get("names", {}).get("en"),
        "city": (r.get("city") or {}).get("names", {}).get("en"),
        "is_morocco": iso == "MA",
        "is_vpn": is_vpn, "is_proxy": is_proxy, "is_tor": is_tor,
        "risk_score": risk, "degraded": False,
    }
```

## 3. IP extraction (respect proxy)
```python
def client_ip(request):
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host
```
(easypanel terminates TLS; `x-forwarded-for` present. Use first hop.)

## 4. Gate logic (used by `/api/geo` AND inside `POST /api/orders`)
```python
def allowed(phone: str, geo: dict) -> bool:
    whitelist = [p.strip() for p in WHITELIST_PHONES.split(",")]
    if phone in whitelist:
        return True
    if not geo.get("is_morocco"):
        return False
    if geo.get("is_vpn") or geo.get("is_proxy") or geo.get("is_tor"):
        return False
    if geo.get("risk_score", 0) >= 2:
        return False
    return True
```

## 5. Frontend flow
1. On "Confirmer" click → `POST /api/geo` (client IP auto). Show result:
   - not Morocco → block form, message "Désolé, réservé au Maroc 🇲🇦".
   - VPN/proxy → "Accès non autorisé depuis ce réseau."
   - Morocco OK → proceed to submit order.
2. Backend RE-CHECKS on `POST /api/orders` (never trust client). Returns `403` with reason code
   `orders_only_morocco` / `vpn_blocked` if denied (and not whitelisted).

## 6. Whitelist
- `WHITELIST_PHONES=0666666666` (env). Bypasses geo + VPN checks so you can test orders in prod.
- Whitelisted orders flagged `test:true` in Sheets `notes` for filtering.
- Never whitelist a real customer number.

## 7. Graceful degradation
- If `MAXMIND_DB_PATH` missing or `MAXMIND_ENABLED=false` → `allowed()` returns True (don't break
  store) and sets `degraded:True` in geo metadata (logged). Re-enable ASAP.

## 8. Phone normalization (for pixels/hashing)
```python
def normalize_phone(ma_phone: str) -> str:
    p = ma_phone.strip().replace(" ", "")
    if p.startswith("0"):
        p = "+212" + p[1:]
    return p   # +2126xxxxxxxxx (TikTok/Meta hashing input)
```

## 9. Updating the DB
- Use MaxMind `geoipupdate` with `MAXMIND_LICENSE_KEY`, or manually download + mount into `geo/`.
- Monthly refresh recommended for accurate VPN/proxy flags.
