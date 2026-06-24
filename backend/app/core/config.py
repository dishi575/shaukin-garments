from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/shaukin_db"
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://shaukin-garments.vercel.app",
        "https://shaukin-garments-nm5v0tn9f-dishitachaturvedi.vercel.app",
        "https://shaukin-garments-git-main-dishitachaturvedi.vercel.app",
    ]

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    APP_NAME: str = "Shaukin Garments"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()