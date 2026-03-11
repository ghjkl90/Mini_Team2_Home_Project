from fastapi import APIRouter
from pydantic import BaseModel
from controllers.analysis import get_analysis_value

router = APIRouter(prefix="/analysis", tags=["analysis"])

class AnalysisRequest(BaseModel):
    institution: str
    age: int
    gender: str
    tenure_years: int
    performance_grade: str
    workload_level: str
    flexible_work: str

@router.post("/")
def get_value(data: AnalysisRequest):
    return get_analysis_value(data.model_dump())