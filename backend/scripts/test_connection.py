from sqlalchemy import create_engine

DB_URL = "mysql+pymysql://root:1234@127.0.0.1:3306/hr_risk_db"

engine = create_engine(DB_URL)

try:
    with engine.connect() as conn:
        print("연결 성공!")
except Exception as e:
    print(f"연결 실패: {e}")
