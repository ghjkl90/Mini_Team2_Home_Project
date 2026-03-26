import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // 같은 CSS 사용

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [institution, setInstitution] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwCheckError, setPwCheckError] = useState("");

  const institutions = [
    { id: 1, name: "코레일테크(주)" },
    { id: 2, name: "한국환경공단" },
    { id: 3, name: "(주)강원랜드" },
  ];

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      !validateEmail(value) ? "이메일 형식이 올바르지 않습니다." : "",
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPwError(value.length < 8 ? "비밀번호는 8자 이상 입력해주세요." : "");
  };

  const handlePasswordCheck = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);
    setPwCheckError(value !== password ? "비밀번호가 일치하지 않습니다." : "");
  };

  const isValid =
    email &&
    password &&
    passwordCheck &&
    institution &&
    !emailError &&
    !pwError &&
    !pwCheckError;

  const handleSignup = async () => {
    try {
      const response = await fetch("http://192.168.0.41:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, institution }),

        //institution
      });
      const data = await response.json();
      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/"); //이 뒤로 Home으로 이동인데 안 되네요.
      } else {
        // 더 만져보려다가 백엔드가 작업하는 게 나아보여서 냅둡니다.
        alert(data.message || "회원가입에 실패했습니다."); // 아니면 준서님 백엔드 코드 제게 넘겨주세요.
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* 화면 전체 중앙 정렬 코드니까 건들지 마세요 - 정은 올림. */}
      <div className="login-page">
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

            <label className="label password-label">기관 선택</label>
            <div className="input-box">
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              >
                <option value="">기관을 선택해주세요</option>
                {institutions.map((org) => (
                  <option key={org.id} value={org.name}>
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
      </div>
    </div>
  );
}
