import axios from "axios";

// 백엔드 서버주소 확인 후 해당 서버주소:포트번호 입력
const API_BASE_URL = "http://192.168.0.2:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 메인 대시보드 통계 데이터 가져오기
export const fetchDashboardData = async (institutionName) => {
  try {
    // Swagger UI 구조에 맞춰 경로를 수정
    // 현재 서버가 /dashboard/{institution} 형태이므로 백틱(`)을 사용해 주소를 만듬
    const response = await api.get(`/dashboard/${institutionName}`);
    return response.data.data;
  } catch (error) {
    console.error("대시보드 API 호출 중 에러 발생:", error);
    throw error;
  }
};
