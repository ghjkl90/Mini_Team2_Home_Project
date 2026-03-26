from fastapi import status
from fastapi.responses import JSONResponse
from services.post import (
    get_institution,
    get_institution_info,
    get_avg_salary,
    get_hiring,
    get_ratio,
    get_health,
    get_risk_summary,
    get_quarter_risk
)

def get_dashboard_controller(institution: str):
    try:
        inst = get_institution(institution)

        if not inst:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": "해당 기관을 찾을 수 없습니다."
                }
            )

        inst_info = get_institution_info(institution)
        avg_sal = get_avg_salary(institution)
        hiring = get_hiring(institution)
        ratio = get_ratio(institution)
        health = get_health(institution)
        risk_summary = get_risk_summary(institution)
        quarter_risk = get_quarter_risk(institution)

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
                    "위험 신호 요약": risk_summary,
                    "분기별 퇴사위험도": quarter_risk
                }
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": "조회 실패",
                "error": str(e)
            }
        )