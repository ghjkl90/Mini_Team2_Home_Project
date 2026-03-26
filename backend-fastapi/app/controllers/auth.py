from fastapi.responses import JSONResponse
from fastapi import status
from services.auth import create_user, login_user
#from utils.security import create_access_token

def signup_controller(request):
    try:
        create_user(request.email, request.password, request.institution)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "회원가입 성공","institution": request.institution},
            
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": f"회원가입 실패: {str(e)}"}
        )

def login_controller(request):
    try:
        user = login_user(request.email, request.password)

        if not user:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "로그인 실패"}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "로그인 성공",
                "user_id": user["id"],
                "institution": user["institution"]
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": f"로그인 오류: {str(e)}"}
        )