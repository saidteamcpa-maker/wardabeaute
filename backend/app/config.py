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

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
