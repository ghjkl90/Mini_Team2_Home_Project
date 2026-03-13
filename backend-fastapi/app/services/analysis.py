from services.predict_employee_ml import predict_employee

def analyze_institution(
    institution,
    age,
    gender,
    tenure_years,
    performance_grade,
    workload_level,
    flexible_work
):
    return predict_employee(
        institution=institution,
        age=age,
        gender=gender,
        tenure_years=tenure_years,
        performance_grade=performance_grade,
        workload_level=workload_level,
        flexible_work=flexible_work
    )