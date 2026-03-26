from fastapi import APIRouter
from schemas.auth import SignupRequest, LoginRequest
from controllers.auth import signup_controller, login_controller

router = APIRouter(tags=["auth"])

@router.post("/signup")
def signup(request: SignupRequest):
    return signup_controller(request)

@router.post("/login")
def login(request: LoginRequest):
    return login_controller(request)