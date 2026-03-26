from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    institution: str
    age: int
    gender: str
    tenure_years: int
    performance_grade: str
    workload_level: str
    flexible_work: str