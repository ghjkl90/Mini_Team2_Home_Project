# # Frontend

## 📊 Public HR Analytics Platform (Front-end)

공공기관 HR 데이터를 기반으로 한 이탈 예측 및 조직 건강도 분석 플랫폼의 프론트엔드 저장소입니다. 본 프로젝트는 스타일 가이드를 준수하여 작성하였습니다.


<br>


## 🎨 Figma


본 프로젝트는 단순한 UI 제작을 넘어, 사용자 입력부터 결과 확인까지의 흐름을 고려하여 화면을 설계했습니다.  
특히 HR 데이터 특성상 정보가 복잡하게 전달될 수 있어, 이를 직관적으로 이해할 수 있도록 카드형 UI와 단계별 구조로 구성했습니다.

또한 실제 프론트엔드 구현을 고려하여 컴포넌트 단위로 화면을 설계하고, React 기반 구조와 자연스럽게 연결될 수 있도록 기획했습니다.


<img width="2873" height="1528" alt="image" src="https://github.com/user-attachments/assets/3da3477c-dbbd-41ed-bbfb-7a5b9cb68721" />


<img width="2876" height="1551" alt="image" src="https://github.com/user-attachments/assets/54aa3580-fbdf-473b-8556-b6c63db7c460" />


<img width="2878" height="1536" alt="image" src="https://github.com/user-attachments/assets/247976e2-8ee6-420b-b09c-607c3ae0d681" />


<br>


## 🛠 Tech Setup
프로젝트 실행을 위해 아래의 라이브러리 설치가 필요합니다.

```bash
# package.json 한번에 설치
npm install

### 선택형 설치시 아래 패키지 참고
# 기본 라우팅
npm install react-router-dom
# 데이터 시각화 (차트 모음)
npm install echarts-for-react recharts react-gauge-chart

Frontend Framework: React  
Programming Languages: JavaScript, Java, Python  
Styling: CSS (일부 라이브러리 없이 직접 구현)  
Design Tools: Figma, Adobe Illustrator, Clip Studio Paint  
Version Control: Git, GitHub  
API Integration: fetch와 axios를 상황에 따라 활용한 REST API 통신, FastAPI 기반 백엔드 연동
```

## 🎨 Coding Style Guide

1. 명명 규칙 (Naming Conventions)
   어떤 환경에서도 가독성을 보장하기 위해 아래 규칙을 적용합니다.

```Plaintext
[ 적용 대상 ]           [ 선택된 표기법 ]      [ 예시 ]
-------------------------------------------------------------------------
변수명 & 파일명         snake_case           user_info, login_page.js
함수 & Method           camelCase            handleLogin(), getData()
Class명                 PascalCase           UserCard, Forecast
상수 & 환경변수         SCREAMING_SNAKE      BASE_URL, MAX_WIDTH
보호 인스턴스           _snake_case          _internal_data
Private 인스턴스        __snake_case         __private_key
-------------------------------------------------------------------------
```

2. 코드 포맷팅 (Formatting)
   - 들여쓰기: Tab 대신 공백(Space) 4칸 사용
   - 라인 제한: 한 줄의 길이는 79자 이내로 작성 (PEP8 기준)
   - 대입 연산: a = 1 처럼 등호 양옆에 공백을 무조건 1개 둔다.
   - Import 순서 (중요):
     - 패키지(외부)를 먼저 몰아서 쓴다.
     - 다음 **줄바꿈(Enter)**을 한 번 한다.
     - 그 아래에 개인 함수나 로컬 파일을 import 한다.
   - 괄호 스타일: K&R 방식 (여는 중괄호는 같은 줄에)

```JavaScript
if (is_valid) {
    do_something();
}
```

3. Import 및 구조 규약
   - Import 순서:
     - 외부 패키지(React, Recharts 등)를 상단에 배치

     - 한 줄 바꿈(Blank Line) 후 개인 컴포넌트 및 CSS 배치

   - 인스턴스 보호:
     - 보호가 필요한 변수: \_로 시작 (예: \_data)
     - Private 변수: **로 시작 (예: **secret)

## 📂 Project Structure

```Plaintext
src/
├── api/             # API 호출 함수 (predict_api.js)
├── components/      # 재사용 카드 및 차트 컴포넌트
├── css/             # 컴포넌트별 스타일 시트
├── pages/           # 주요 페이지 (Home, Mains, Login, Forecast)
└── App.js           # 메인 라우터
```

🛠️ 개발 참여 시 주의사항

1. 파일 생성 시 반드시 스네이크 표기법(snake_case.js)을 사용하세요.
2. 새로운 차트 컴포넌트를 추가할 경우 README.md의 의존성 섹션을 업데이트해 주세요.
3. 모든 대입 연산 시 a=1이 아닌 a = 1 형태를 유지해 주세요.

<br>

# 페이지 컴포넌트 별 백엔드 데이터 값 호출 및 시각화 설명

### \*\* 한 줄 요약

1. Main 대시보드 페이지는 GET 한 방으로 전체 데이터를 받아서 각 컴포넌트에 나눠주는 구조
2. Forecast 예측 페이지는 POST로 입력값을 보내서 ML(머신러닝) 결과를 받아오는 구조

### **Mains.js — 대시보드 페이지**

fetchDashboardData(기관명) 함수 하나로 GET /dashboard/{기관명} 을 호출해서
전체 데이터를 한 번에 받아와서 그 결과를 각 컴포넌트에 나누어줌
(백엔드에 호출값 as 가 한글로 정의되어 있어서 한글 동일 값으로 호출)

### ① SalaryCard

1. 호출 키: res["평균 임금 비교"][0]
2. 가져오는 값: 전체기관 직원 평균 보수, 우리 기관 직원평균보수
3. 시각화: 막대 차트로 전체 평균 vs 우리 기관 비교

### ② RecruitmentGaugeCard

1. 호출 키: res["채용경쟁력"][0]["채용 경쟁력 점수"]
2. 가져오는 값: 채용 경쟁력 점수 (원시값 15~73 범위)
3. 처리: (raw - 15) / (73 - 15) \* 100 으로 0~100점 환산
4. 시각화: 게이지 차트 + A/B/C 등급 표시

### ③ AttritionRiskCard

1. 호출 키: res["분기별 퇴사위험도"]
2. 가져오는 값: 분기명, 분기별 퇴사위험도 (0~1 소수값)
3. 처리: \* 100 해서 % 변환, 전체 평균 37% 고정값과 비교
4. 시각화: 꺾은선 차트 + 전체 평균 기준선(레퍼런스 라인)

### ④ WorkFlexibilityCard

1. 호출 키: res["유연근무유형"][0]
2. 가져오는 값: 원격·시차·압축 근무 비율 (기관 + 전체 평균)
3. 시각화: 도넛 차트 2개 (전체 vs 기관 비교)

### ⑤ HealthDiagnosisCard

1. 호출 키: res["조직 건강도"][0]
2. 가져오는 값: 조직 건강도 점수, 조직 건강도 수준 (high/medium/low)
3. 처리: high→A, medium→B, low→C 등급 변환
4. 시각화: 점수 + 등급 텍스트 표시

### ⑥ RiskSignalCard

1. 호출 키: res["위험 신호 요약"][0]["위험 신호 요약"]
2. 가져오는 값: 쉼표로 구분된 위험 신호 문자열
3. 처리: 쉼표로 split 후 배열로 변환
4. 추가로 채용점수·건강도점수·최근 퇴사율을 직접 계산해서 CRITICAL/WARNING 판정
5. 시각화: 위험 순위 카드 + 맞춤형 권고 문장

### ⑦ HRBalanceChartCard

1. 별도 API 호출 없음 — 위에서 받은 값들을 재조합
2. 임금: 우리기관 / 전체평균 \* 85
3. 유연근무: 3가지 비율 합계 \* 100
4. 이탈방어: 100 - 최근 퇴사위험도
5. 채용·건강도: 그대로 사용
6. 시각화: 5각형 레이더 차트

<br>

### **Forecast.jsx — 직원 예측 페이지**

predictEmployee(입력값) 함수로 POST /analysis 를 호출.

### ① InputPanel

1. 사용자가 나이·성별·근무연수·성과등급·업무강도·유연근무 입력
2. 제출 시 onPredict(form) 으로 Forecast.jsx에 전달

### ② GaugeChart(퇴사위험, 번아웃)

1. 받아오는 값: quit_risk_probability, burnout_risk_probability
2. 데이터값 \* 100 으로 % 변환 하여 점수 표기
3. 시각화: 반원 게이지 2개 (퇴사 위험도 / 번아웃 위험도)

### ③ ResultPanel

1. 받아오는 값: expected_remaining_tenure, expected_total_tenure, risk_factors, raw_diagnosis, final_report
2. 시각화: 텍스트 카드 형태로 잔여 근속·위험 요인·AI 추천 솔루션 표시


