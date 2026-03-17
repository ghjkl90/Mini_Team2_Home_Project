import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");

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

  const isValid = email && password && !emailError && !pwError;

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.2:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/mains");
      } else {
        alert(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* 화면 중앙 정렬 */}
      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">
            이메일과 비밀번호를
            <br />
            입력해주세요
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
          </div>

          <button
            className="login-button"
            disabled={!isValid}
            onClick={handleLogin}
          >
            로그인
          </button>

          <p
            style={{ cursor: "pointer", marginTop: "20px" }}
            onClick={() => (window.location.href = "/signup")}
          >
            회원가입 하기
          </p>
        </div>
      </div>
    </div>
  );
}
