from fastapi.responses import JSONResponse
from fastapi import status
from services.analysis import analyze_institution

def analysis_controller(request):
    try:
        result = analyze_institution(
            request.institution,
            request.age,
            request.gender,
            request.tenure_years,
            request.performance_grade,
            request.workload_level,
            request.flexible_work
        )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "분석 데이터 수집 완료",
                "data": result
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": f"분석 실패: {str(e)}"
            }
        )