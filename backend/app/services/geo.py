"""MaxMind GeoLite2/GeoIP2 lookup. Degrades gracefully when DB is absent."""
import os

from ..config import settings

_reader = None
_enabled = settings.maxmind_enabled and bool(settings.maxmind_db_path)

if _enabled:
    try:
        import maxminddb

        if os.path.exists(settings.maxmind_db_path):
            _reader = maxminddb.open_database(settings.maxmind_db_path)
        else:
            _enabled = False
    except Exception:
        _enabled = False


def lookup(ip: str) -> dict:
    if not _enabled or _reader is None:
        return {
            "country_iso": None, "country_name": None, "city": None,
            "is_morocco": True, "is_vpn": False, "is_proxy": False,
            "is_tor": False, "risk_score": 0, "degraded": True,
        }
    try:
        r = _reader.get(ip) or {}
    except Exception:
        return {
            "country_iso": None, "country_name": None, "city": None,
            "is_morocco": True, "is_vpn": False, "is_proxy": False,
            "is_tor": False, "risk_score": 0, "degraded": True,
        }
    iso = (r.get("country") or r.get("registered_country") or {}).get("iso_code")
    traits = r.get("traits", {})
    is_vpn = bool(traits.get("is_vpn"))
    is_proxy = bool(traits.get("is_public_proxy") or traits.get("is_anonymous_proxy"))
    is_tor = bool(traits.get("is_tor_exit_node"))
    risk = sum([is_vpn, is_proxy, is_tor])
    return {
        "country_iso": iso,
        "country_name": (r.get("country") or {}).get("names", {}).get("en"),
        "city": (r.get("city") or {}).get("names", {}).get("en"),
        "is_morocco": iso == "MA",
        "is_vpn": is_vpn, "is_proxy": is_proxy, "is_tor": is_tor,
        "risk_score": risk, "degraded": False,
    }


def normalize_phone(ma_phone: str) -> str:
    p = (ma_phone or "").strip().replace(" ", "")
    if p.startswith("0"):
        p = "+212" + p[1:]
    return p


def allowed(phone: str, geo: dict) -> bool:
    whitelist = [x.strip() for x in settings.whitelist_phones.split(",") if x.strip()]
    if phone in whitelist:
        return True
    if not geo.get("is_morocco"):
        return False
    if geo.get("is_vpn") or geo.get("is_proxy") or geo.get("is_tor"):
        return False
    if (geo.get("risk_score") or 0) >= 2:
        return False
    return True
