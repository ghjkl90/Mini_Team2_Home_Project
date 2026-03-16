import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [institution, setInstitution] = useState("");

  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwCheckError, setPwCheckError] = useState("");

  const organizations = [
    { id: 1, name: "(사)남북교류협력지원협회" },
    { id: 2, name: "(재)일제강제동원피해자지원재단" },
    { id: 3, name: "(주)강원랜드" },
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

    // 비밀번호 바꿨을 때 확인란도 다시 검사
    if (passwordCheck && value !== passwordCheck) {
      setPwCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPwCheckError("");
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
    institution &&
    !emailError &&
    !pwError &&
    !pwCheckError;

  const handleSignup = async () => {
    if (!isValid) return;

    try {
      const response = await fetch("http://192.168.0.2:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          institution: institution,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "회원가입 실패");
        return;
      }

      alert(data.message);
      console.log(data);

      // 필요하면 입력 초기화
      setEmail("");
      setPassword("");
      setPasswordCheck("");
      setInstitution("");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버 연결 실패");
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

        <label className="label password-label">기관 선택</label>
        <div className="input-box">
          <select
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            <option value="">기관을 선택해주세요</option>
            {organizations.map((org) => (
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
  );
}