from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./warda.db"
    cors_origins: str = "http://localhost:3000,https://wardabeaute.com"
    sheets_webhook_url: str = ""
    maxmind_db_path: str = ""
    maxmind_enabled: bool = False
    whitelist_phones: str = "0666666666"
    fb_pixel_id: str = ""
    fb_capi_token: str = ""
    tt_pixel_id: str = ""
    tt_capi_token: str = ""
    whatsapp_token: str = ""
    admin_secret: str = ""


settings = Settings()
