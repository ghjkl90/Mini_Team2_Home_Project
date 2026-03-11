from services.analysis import get_employee_analysis

def get_analysis_value(payload: dict):
    return get_employee_analysis(payload)