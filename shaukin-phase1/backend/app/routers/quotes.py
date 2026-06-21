from fastapi import APIRouter
router = APIRouter()

@router.get("")
async def list_quotes():
    return {"message": "Bulk quotes endpoint — fully built in Phase 3"}
