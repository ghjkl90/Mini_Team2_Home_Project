
from sqlalchemy import text
from utils.database import engine
from decimal import Decimal

def convert_decimal(rows):
    result = [dict(row._mapping) for row in rows]

    for row in result:
        for key, value in row.items():
            if isinstance(value, Decimal):
                row[key] = float(value)
    return result

#[dict(row._mapping) for row in rows]
# 2페이지 맨위 기관명 데이터
def get_institution(institution:str):
    query = """
    SELECT institution AS `기관명`
    FROM institution_table
    WHERE institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query),{"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 맨위 기관 정보 데이터
def get_institution_info(institution:str):
    query = """
    SELECT institution_type AS `기관유형`,
    ministry AS `주무부처`,
    region AS `소재지`,
    institution_size AS `임직원수`
    FROM institution_table
    WHERE institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query),{"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 1번째 슬롯 /평균 임금 비교
def get_avg_salary(institution: str):
    query = """
    SELECT 
        직원평균보수,
        (SELECT AVG(직원평균보수) FROM alio_master_table) AS `전체기관 직원 평균 보수`
    FROM alio_master_table
    WHERE `기관명` = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query), {"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 2번째 슬롯 /채용경쟁력
def get_hiring(institution:str):
    query = """
    SELECT 
        t.hiring_competitiveness_score AS `채용 경쟁력 점수`,
        t.hiring_competitiveness_level AS `채용 경쟁력 수준`,
        ROUND(
            (
                (
                    SELECT COUNT(*)
                    FROM institution_table
                    WHERE hiring_competitiveness_score > t.hiring_competitiveness_score
                ) / (SELECT COUNT(*) FROM institution_table)
            ) * 100,
            2
        ) AS `채용 경쟁력 점수 상위 비율`
    FROM institution_table t
    WHERE t.institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query),{"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 3번째 슬롯 /유연근무 유형
def get_ratio(institution: str):
    query = """
    SELECT 
        flex_time_ratio AS `시간유연근무 비율`,
        remote_ratio AS `원격근무 비율`,
        compress_ratio AS `압축근무 비율`,
        (SELECT AVG(flex_time_ratio) FROM flexible_table) AS `전체기관 시간유연근무 비율`,
        (SELECT AVG(remote_ratio) FROM flexible_table) AS `전체기관 원격근무 비율`,
        (SELECT AVG(compress_ratio) FROM flexible_table) AS `전체기관 압축근무 비율`
    FROM flexible_table
    WHERE institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query), {"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)


# 2페이지 4번째 슬롯 / 조직 건강도 진단
def get_health(institution:str):
    query = """
    SELECT 
        org_health_score AS `조직 건강도 점수`,
        org_health_level AS `조직 건강도 수준`
        FROM institution_table
    WHERE institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query),{"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 5번째 슬롯 / 위험신호 요약
def get_risk_summary(institution: str):
    query = """
    SELECT 
        risk_signal_summary AS `위험 신호 요약`
    FROM institution_table
    WHERE institution = :institution
    """
    with engine.connect() as con:
        res = con.execute(text(query), {"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)

# 2페이지 6번째 슬롯 / 기관 평균 퇴사 위험도

def get_quarter_risk(institution: str):
    query = """
    SELECT 
        quarter AS `분기`,
        quarter_avg_quit_probability AS `분기별 퇴사위험도`
    FROM risk_table
    WHERE institution = :institution
    ORDER BY quarter
    """
    with engine.connect() as con:
        res = con.execute(text(query), {"institution": institution})
        rows = res.fetchall()
    return convert_decimal(rows)








