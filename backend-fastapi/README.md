# 📌 API Specification

---

## 🔐 Auth API

### ✅ POST /signup

- **설명**  
  사용자 회원가입을 처리하는 API

---

### 📥 Request

```json
{
  "email": "test@example.com",
  "password": "1234",
  "institution": "기관명"
}
```

| 필드명      | 타입   | 필수 여부 | 설명          |
| ----------- | ------ | --------- | ------------- |
| email       | string | O         | 사용자 이메일 |
| password    | string | O         | 비밀번호      |
| institution | string | O         | 소속 기관명   |

---

### 📤 Response

```json
{
  "message": "회원가입 성공",
  "institution": "기관명"
}
```

---

### ⚠️ Error Response

```json
{
  "message": "회원가입 실패: 에러 내용"
}
```

| 상태코드 | 설명                       |
| -------- | -------------------------- |
| 400      | 중복 이메일 또는 요청 오류 |

---

---

### ✅ POST /login

- **설명**  
  사용자 로그인 처리 API

---

### 📥 Request

```json
{
  "email": "test@example.com",
  "password": "1234"
}
```

---

### 📤 Response

```json
{
  "message": "로그인 성공",
  "user_id": 1,
  "institution": "기관명"
}
```

---

### ⚠️ Error Response

```json
{
  "message": "로그인 실패"
}
```

| 상태코드 | 설명      |
| -------- | --------- |
| 401      | 인증 실패 |
| 400      | 요청 오류 |

---

---

## 📊 Dashboard API

### ✅ GET /dashboard/{institution}

- **설명**  
  기관 데이터를 종합 조회하는 API

---

### 📥 Path Parameter

| 변수명      | 타입   | 설명      |
| ----------- | ------ | --------- |
| institution | string | 기관 이름 |

---

### 📤 Response

```json
{
  "message": "조회 성공",
  "data": {
    "기관명": [...],
    "기관정보": [...],
    "평균 임금 비교": [...],
    "채용경쟁력": [...],
    "유연근무유형": [...],
    "조직 건강도": [...],
    "위험 신호 요약": [...],
    "분기별 퇴사위험도": [...]
  }
}
```

---

### 📌 데이터 설명

| 항목              | 설명                     |
| ----------------- | ------------------------ |
| 기관명            | 기관 기본 정보           |
| 기관정보          | 기관 유형, 부처, 지역 등 |
| 평균 임금 비교    | 기관 vs 전체 평균        |
| 채용경쟁력        | 점수 및 수준             |
| 유연근무유형      | 근무 형태 비율           |
| 조직 건강도       | 조직 상태 평가           |
| 위험 신호 요약    | 주요 리스크              |
| 분기별 퇴사위험도 | 시간 흐름에 따른 위험도  |

---

### ⚠️ Error Response

```json
{
  "message": "해당 기관을 찾을 수 없습니다."
}
```

| 상태코드 | 설명      |
| -------- | --------- |
| 404      | 기관 없음 |
| 400      | 서버 오류 |

---

---

## 🔍 Analysis API

### ✅ POST /analysis

- **설명**  
  사용자 정보를 기반으로 퇴사 위험도를 예측하는 API

---

### 📥 Request

```json
{
  "institution": "기관명",
  "age": 30,
  "gender": "male",
  "tenure_years": 5,
  "performance_grade": "A",
  "workload_level": "high",
  "flexible_work": true
}
```

---

### 📤 Response

```json
{
  "message": "분석 데이터 수집 완료",
  "data": {
    "prediction": "이직 가능성 낮음",
    "score": 0.23
  }
}
```

---

### ⚠️ Error Response

```json
{
  "message": "분석 실패: 에러 내용"
}
```

| 상태코드 | 설명      |
| -------- | --------- |
| 400      | 요청 오류 |

---

---

## 🧩 시스템 구조

- **Router**
  - `/auth`, `/dashboard`, `/analysis` 엔드포인트 정의

- **Controller**
  - 요청 처리 및 응답 반환

- **Service**
  - 비즈니스 로직 수행

- **DB / ML**
  - 데이터 조회 및 예측 수행

---

## 🔄 전체 흐름

1. 클라이언트 요청 (회원가입 / 로그인 / 조회 / 분석)
2. Router → Controller 전달
3. Controller → Service 호출
4. Service → DB 또는 ML 처리
5. 결과 반환 (JSONResponse)
