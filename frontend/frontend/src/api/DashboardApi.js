import axios from "axios";

// 백엔드 서버주소 확인 후 해당 서버주소:포트번호 입력
const API_BASE_URL = "http://192.168.0.41:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDashboardData = async (institutionName) => {
  try {
    // 1. 특수문자 '㈜'가 들어오면 일반 '(주)'로 바꿉니다.
    // 2. 반대로 일반 '(주)'가 들어왔는데 서버가 '㈜'를 원할 수도 있으니,
    //    실패 시 재시도 로직을 포함하는 게 가장 안전합니다.
    let targetName = institutionName.replace(/㈜/g, "(주)").trim();
    let encodedName = encodeURIComponent(targetName);
    console.log("🚀 1차 시도 (일반 괄호):", targetName);
    try {
      const response = await api.get(`/dashboard/${encodedName}`);
      return response.data.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 3. 만약 (주)로 해서 404라면, 이번엔 특수기호 ㈜로 바꿔서 한 번 더 시도!
        const altName = institutionName.replace(/\(주\)/g, "㈜").trim();
        console.log("⚠️ 1차 실패, 2차 시도 (특수기호):", altName);
        const retryRes = await api.get(
          `/dashboard/${encodeURIComponent(altName)}`,
        );
        return retryRes.data.data;
      }
      throw err;
    }
  } catch (error) {
    console.error("대시보드 데이터 호출 최종 실패:", error);
    throw error;
  }
};
