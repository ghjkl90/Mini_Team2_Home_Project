from fastapi import APIRouter

from app.controllers.auth import login_controller, signup_controller
from app.schemas.auth import LoginRequest, SignupRequest

router = APIRouter(tags=["auth"])


@router.post("/signup")
def signup(request: SignupRequest):
    return signup_controller(request)


@router.post("/login")
def login(request: LoginRequest):
    return login_controller(request)
