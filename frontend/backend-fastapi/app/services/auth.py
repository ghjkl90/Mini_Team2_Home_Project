from sqlalchemy import text
from utils.database import engine
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
def create_user(email: str, password: str, institution: str):
    query = text("""
        INSERT INTO users (email, password, institution)
        VALUES (:email, :password, :institution)
    """)

    try:
        with engine.connect() as conn:
            conn.execute(query, {
                "email": email,
                "password": password,
                "institution": institution
            })
            conn.commit()

        return {"message": "회원가입 성공"}

    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="이미 사용 중인 이메일입니다."
        )

def login_user(email: str, password: str):
    query = text("""
        SELECT id, email, institution
        FROM users
        WHERE email = :email
          AND password = :password
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {
            "email": email,
            "password": password
        }).mappings().first()

    return result

def get_user_by_id(user_id: int):
    query = text("""
        SELECT id, email, institution
        FROM users
        WHERE id = :user_id
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {
            "user_id": user_id
        }).mappings().first()

    return result