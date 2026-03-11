from services.predict_employee_ml import get_predictor

predictor = get_predictor()

def get_employee_analysis(payload: dict):
    result = predictor.predict_from_dict(payload)
    return {
        "message": "조회 성공",
        "data": result
    }