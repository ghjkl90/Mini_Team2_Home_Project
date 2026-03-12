const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const users = [
  {
    email: "cute@naver.com",
    password: "741456963",
  },
];
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      message: "이메일이 존재하지 않습니다",
    });
  }

  const isMatch = password === user.password;

  if (!isMatch) {
    return res.status(401).json({
      message: "비밀번호가 틀렸습니다",
    });
  }

  res.json({
    message: "로그인 성공",
    email: user.email,
  });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
