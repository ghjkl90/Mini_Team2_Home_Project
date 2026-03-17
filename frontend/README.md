📊 Public HR Analytics Platform (Front-end)
공공기관 HR 데이터를 기반으로 한 이탈 예측 및 조직 건강도 분석 플랫폼의 프론트엔드 저장소입니다. 본 프로젝트는 스타일 가이드를 준수하여 작성하였습니다.

⚙️ Installation & Dependencies
프로젝트 실행을 위해 아래의 라이브러리 설치가 필요합니다.

```Bash
# 기본 라우팅
npm install react-router-dom

# 데이터 시각화 (차트 모음)
npm install echarts-for-react recharts react-gauge-chart
```

🎨 Coding Style Guide

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

📂 Project Structure

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
