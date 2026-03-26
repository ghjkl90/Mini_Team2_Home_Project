import { useState } from "react";
import "../css/Forecast.css";

function InputPanel({ onPredict }) {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    tenure_years: "",
    performance_grade: "",
    workload_level: "",
    flexible_work: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (
      !form.age ||
      !form.gender ||
      !form.tenure_years ||
      !form.performance_grade ||
      !form.workload_level
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    onPredict(form);
  };

  return (
    <div className="inputPanelInner">
      <h1 className="title-main">Find Organization</h1>
      <p className="title-sub">직원 정보 입력</p>

      <div className="formWrapper">
        <div className="fieldGroup">
          <label>나이</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="나이를 입력하세요."
          />
        </div>

        <div className="fieldGroup">
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">성별을 선택하세요.</option>
            <option value="male">남</option>
            <option value="female">여</option>
          </select>
        </div>

        <div className="fieldGroup">
          <label>근무연수</label>
          <input
            type="number"
            name="tenure_years"
            value={form.tenure_years}
            onChange={handleChange}
            placeholder="근무연수를 입력하세요."
          />
        </div>

        <div className="fieldGroup">
          <label>업무성과등급</label>
          <select
            name="performance_grade"
            value={form.performance_grade}
            onChange={handleChange}
          >
            <option value="">업무성과등급을 선택하세요.</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="fieldGroup">
          <label>근무강도</label>
          <select
            name="workload_level"
            value={form.workload_level}
            onChange={handleChange}
          >
            <option value="yo">근무강도를 선택하세요.</option>
            <option value="High">높음</option>
            <option value="Middle">보통</option>
            <option value="Low">낮음</option>
          </select>
        </div>

        <div className="checkbox-row">
          <label className="custom-checkbox">
            <span>유연근무 여부</span>
            <input
              type="checkbox"
              name="flexible_work"
              checked={form.flexible_work}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <button className="submitBtn" onClick={handleSubmit}>
          예측
        </button>
      </div>
    </div>
  );
}

export default InputPanel;
