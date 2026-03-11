from fastapi import status, Path, Body
from fastapi.responses import JSONResponse
from services.post import get_institution
from services.post import get_institution_info
from services.post import get_avg_salary
from services.post import get_hiring
from services.post import get_ratio
from services.post import get_health 
from services.post import get_risk
# from services.post import get_quik

def get_dashboard_controller(institution:str):
    try:
        inst = get_institution(institution)
        inst_info = get_institution_info(institution)
        avg_sal = get_avg_salary(institution)
        hiring = get_hiring(institution)
        ratio = get_ratio(institution)
        health = get_health(institution)
        risk = get_risk(institution)
        #quik = get_quik(institution)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "조회 성공",
                "data": {
                    "기관명": inst,
                    "기관정보": inst_info,
                    "평균 임금 비교": avg_sal,
                    "채용경쟁력": hiring,
                    "유연근무유형": ratio,
                    "조직 건강도": health,
                    "위험 신호 요약": risk
                }
            })
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": "조회 실패",
                "error": str(e)
            }
        )

