import pandas as pd
from app.utils.database import engine

def load_csv_to_table():
    df = pd.read_csv("app/data/institution_kpi_table.csv")
    print("CSV 읽기 성공")

    df.to_sql("institution_table", engine, index=False, if_exists="replace")
    print("CSV → DB 테이블 생성 성공")
# 위에 들어가는 내용 : institution, institution_type, ministry, region, institution_size
# 조직 건강도 :  org_health_score, org_heath_level
# 채용 경쟁력 : hiring_competitiveness_score, hiring_competitiveness_level, hiring_competitiveness_top_percent
# 위험 신호 요약 : risk_signal_summary

def load_csv_to_table_alio():
    df = pd.read_csv("app/data/alio_master_table.csv")
    print("CSV 읽기 성공")
    # (주) 앞에 붙이기
    df["institution"] = df["institution"].str.replace(r"㈜", "", regex=False)
    df["institution"] = "(주)" + df["institution"]
    df.to_sql("alio_master_table", engine, index=False, if_exists="replace")
    print("CSV → DB 테이블 생성 성공")
# 평균임금비교 : 직원 평균 보수 ->전체 평균


def load_csv_to_table_flexible():
    df = pd.read_csv("app/data/institution_flexible_work_table.csv")
    print("CSV 읽기 성공")

    df.to_sql("flexible_table", engine, index=False, if_exists="replace")
    print("CSV → DB 테이블 생성 성공")
# 유연 근무 유형 : flex_time_ratio, remote_ratio, compress_ratio

def load_csv_to_table_risk():
    df = pd.read_csv("app/data/institution_quarter_kpi_table.csv")
    print("CSV 읽기 성공")

    df.to_sql("risk_table", engine, index=False, if_exists="replace")
    print("CSV → DB 테이블 생성 성공")
# 분기별 퇴사 위험도 : institution, quarter, quarter_avg_quit_probability

if __name__ == "__main__":
    load_csv_to_table()
    # load_csv_to_table_alio()
    # load_csv_to_table_flexible()
    # load_csv_to_table_risk()