from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    institution: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str