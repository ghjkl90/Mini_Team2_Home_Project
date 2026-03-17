import { useState } from "react";

function InputPanel({ onPredict }) {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    workYears: "",
    grade: "",
    workLoad: "",
    flexWork: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    // 빈 값이 있는지 체크
    if (!form.age || !form.gender || !form.workYears) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    onPredict(form);
  };

  return (
    <div className="leftPanel">
      <h3>직원 정보 입력</h3>

      <label>나이</label>
      <input name="age" type="number" onChange={handleChange} />

      <label>성별</label>
      <select name="gender" onChange={handleChange} className="gender-select">
        <option value="">성별 선택</option>
        <option value="M">남성</option>
        <option value="F">여성</option>
      </select>

      <label>근무년수</label>
      <input name="workYears" type="number" onChange={handleChange} />

      <label>업무성과등급</label>
      <select name="grade" onChange={handleChange} className="grade-select">
        <option value="">등급 선택</option>
        <option value="A">A 등급 (매우 우수)</option>
        <option value="B">B 등급 (우수)</option>
        <option value="C">C 등급 (보통)</option>
        <option value="D">D 등급 (미흡)</option>
      </select>

      <label>업무강도</label>
      <select
        name="workLoad"
        onChange={handleChange}
        className="workload-select"
      >
        <option value="">강도 선택</option>
        <option value="high">강 (High)</option>
        <option value="medium">중 (Medium)</option>
        <option value="low">약 (Low)</option>
      </select>

      <div className="checkbox-row">
        <input
          name="flexWork"
          type="checkbox"
          id="flexWork"
          onChange={handleChange}
        />
        <label htmlFor="flexWork">유연근무 여부</label>
      </div>
      <button onClick={handleSubmit}>결과보기</button>
    </div>
  );
}

export default InputPanel;
