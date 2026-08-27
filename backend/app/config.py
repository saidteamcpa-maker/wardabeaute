from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./warda.db"
    cors_origins: str = "*"
    sheets_webhook_url: str = "https://script.google.com/macros/s/AKfycbybYq3NDTzqj2vsOacTq8CWNweiMBvptn4oa44Y9DLXLTi7WtlARGwZjeefbRt09lBj/exec"
    maxmind_db_path: str = ""
    maxmind_enabled: bool = False
    whitelist_phones: str = "0666666666"

    @property
    def sheets_url(self) -> str:
        # docker-compose may inject empty string which would override the default;
        # treat empty/whitespace as "not set" and fall back to the hardcoded /exec URL.
        v = (self.sheets_webhook_url or "").strip()
        if v:
            return v
        return "https://script.google.com/macros/s/AKfycbybYq3NDTzqj2vsOacTq8CWNweiMBvptn4oa44Y9DLXLTi7WtlARGwZjeefbRt09lBj/exec"
    fb_pixel_id: str = ""
    fb_capi_token: str = ""
    tt_pixel_id: str = ""
    tt_capi_token: str = ""
    whatsapp_token: str = ""
    admin_secret: str = ""
    # SpaceSeller Marketplace (server-only, never NEXT_PUBLIC)
    # Supports both spellings: SPACESSELLER_* and SPACESHELL_* (guide uses drop.spaceseller.ma)
    spaceseller_base_url: str = "https://drop.spaceseller.ma/api/v1"
    spaceshell_base_url: str = ""
    spaceseller_token: str = ""
    spaceshell_token: str = ""
    spaceseller_enabled: bool = True
    spaceshell_enabled: bool = True

    @property
    def spaceseller_url(self) -> str:
        # Prefer spaceseller, fallback to spaceshell, then default
        v = (self.spaceseller_base_url or "").strip().rstrip("/")
        if v:
            return v
        v2 = (self.spaceshell_base_url or "").strip().rstrip("/")
        if v2:
            return v2
        return "https://drop.spaceseller.ma/api/v1"

    @property
    def spaceseller_token_clean(self) -> str:
        # Accept either spelling
        t = (self.spaceseller_token or "").strip()
        if t:
            return t
        return (self.spaceshell_token or "").strip()

    @property
    def is_spaceseller_enabled(self) -> bool:
        if not self.spaceseller_token_clean:
            return False
        # If either enabled flag is False, disable
        if not self.spaceseller_enabled or not self.spaceshell_enabled:
            return False
        return True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
