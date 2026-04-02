import os

from fastapi import HTTPException
import firebase_admin
import firebase_admin.auth
import firebase_admin.firestore
import requests
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.utils.database import engine


class MySQLAuthService:
    @staticmethod
    def create_user(email: str, password: str, institution: str):
        query = text("""
            INSERT INTO users (email, password, institution)
            VALUES (:email, :password, :institution)
        """)

        try:
            with engine.connect() as conn:
                conn.execute(
                    query,
                    {"email": email, "password": password, "institution": institution},
                )
                conn.commit()

            return {"message": "회원가입 성공"}

        except IntegrityError:
            raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다.")

    @staticmethod
    def login_user(email: str, password: str):
        query = text("""
            SELECT id, email, institution
            FROM users
            WHERE email = :email
              AND password = :password
        """)

        with engine.connect() as conn:
            result = (
                conn.execute(query, {"email": email, "password": password})
                .mappings()
                .first()
            )

        return result

    @staticmethod
    def get_user_by_id(user_id: int):
        query = text("""
            SELECT id, email, institution
            FROM users
            WHERE id = :user_id
        """)

        with engine.connect() as conn:
            result = conn.execute(query, {"user_id": user_id}).mappings().first()

        return result


cred = firebase_admin.credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firebase_admin.firestore.client()

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

class FirebaseAuthService:
    @staticmethod
    def create_user(email: str, password: str, institution: str):
        try:
            user = firebase_admin.auth.create_user(email=email, password=password)

            db.collection("users").document(user.uid).set(
                {"id": email, "institution": institution}
            )

            return {"message": "회원가입 성공"}
        except Exception as e:
            print(f"회원가입 실패: {e}")
            raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다.")

    @staticmethod
    def get_user_info(uid):
        user_data = db.collection("users").document(uid).get()
        if user_data.exists:
            return user_data.to_dict()
        else:
            return None

    @staticmethod
    def login_user(email: str, password: str):
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    
        data = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 200:
            user_uid = result['localId']
            # id_token = result['idToken']

            return FirebaseAuthService.get_user_info(user_uid)
        else:
            print(f"로그인 실패: {result['error']['message']}")
            return None


AuthService = FirebaseAuthService

create_user = AuthService.create_user
login_user = AuthService.login_user
