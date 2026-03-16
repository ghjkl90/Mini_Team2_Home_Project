import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [organizationId, setOrganizationId] = useState("");

  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwCheckError, setPwCheckError] = useState("");

  // 기관 목록 예시이고, 아래대로 연결하면 됨.
  /*useEffect(() => {
  fetch("http://localhost:5000/organizations")
    .then((res) => res.json())
    .then((data) => setOrganizations(data));
}, []);*/

  const organizations = [
    { id: 1, name: "한국관광공사" },
    { id: 2, name: "국제데이터포털" },
    { id: 3, name: "공공기관 데이터" },
  ];

  const validateEmail = (value) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setPwError("비밀번호는 8자 이상 입력해주세요.");
    } else {
      setPwError("");
    }
  };

  const handlePasswordCheck = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);

    if (value !== password) {
      setPwCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPwCheckError("");
    }
  };

  const isValid =
    email &&
    password &&
    passwordCheck &&
    organizationId &&
    !emailError &&
    !pwError &&
    !pwCheckError;

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          organizationId: organizationId,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        회원가입을 위해
        <br />
        정보를 입력해주세요
      </h2>

      <div className="form-area">
        <label className="label">이메일</label>
        <div className="input-box">
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@email.com"
          />
        </div>

        {emailError && <p className="error-text">{emailError}</p>}

        <label className="label password-label">비밀번호</label>
        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호 입력"
          />
        </div>

        {pwError && <p className="error-text">{pwError}</p>}

        <label className="label password-label">비밀번호 확인</label>
        <div className="input-box">
          <input
            type="password"
            value={passwordCheck}
            onChange={handlePasswordCheck}
            placeholder="비밀번호 확인"
          />
        </div>

        {pwCheckError && <p className="error-text">{pwCheckError}</p>}

        {/* 기관 선택 드롭다운 */}
        <label className="label password-label">기관 선택</label>
        <div className="input-box">
          <select
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
          >
            <option value="">기관을 선택해주세요</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="login-button"
        disabled={!isValid}
        onClick={handleSignup}
      >
        회원가입
      </button>
    </div>
  );
}
