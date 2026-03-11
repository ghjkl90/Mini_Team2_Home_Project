import pandas as pd
from app.utils.database import engine

def load_csv_to_table():
    df = pd.read_csv("app/data/institution_kpi_table.csv")
    print("CSV 읽기 성공")

    df.to_sql("institution_table", engine, index=False, if_exists="replace")
    print("CSV → DB 테이블 생성 성공")

if __name__ == "__main__":
    load_csv_to_table()