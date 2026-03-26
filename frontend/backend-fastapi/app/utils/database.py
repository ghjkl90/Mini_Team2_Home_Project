import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

user_id = os.getenv("USER_ID")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")


db_info = f"mysql+pymysql://{user_id}:{password}@{host}/{db_name}"
engine = create_engine(db_info, connect_args={})
print(engine)