from fastapi import APIRouter

from app.controllers.post import get_dashboard_controller

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/{institution}")
def get_institution(institution: str):
    return get_dashboard_controller(institution)
