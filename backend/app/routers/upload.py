from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import cloudinary
import cloudinary.uploader
from app.core.config import settings
from app.core.security import require_admin

router = APIRouter()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    _admin=Depends(require_admin),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")
    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 5MB")

    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        folder="shaukin-garments/products",
        transformation=[{"width": 800, "height": 800, "crop": "limit", "quality": "auto"}],
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}