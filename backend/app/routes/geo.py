from fastapi import APIRouter, Request

from ..services import geo

router = APIRouter(prefix="/api")


@router.post("/geo")
def geo_check(request: Request):
    ip = request.client.host if request.client else ""
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        ip = fwd.split(",")[0].strip()
    result = geo.lookup(ip)
    result["ip"] = ip
    result["allowed"] = geo.allowed("", result)  # phone empty -> geo only
    return result
