from fastapi import APIRouter

from app.controllers.analysis import analysis_controller
from app.schemas.analysis import AnalysisRequest

router = APIRouter(tags=["analysis"])


@router.post("/analysis")
def analyze(request: AnalysisRequest):
    return analysis_controller(request)
