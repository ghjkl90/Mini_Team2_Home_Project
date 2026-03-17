import "./Home.css";
import { useNavigate } from "react-router-dom";
import GallerySlider from "../components/GallerySlider";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-spider-left">
        <img src="/images/spider.png" alt="spider" />
      </div>

      <div className="home-spider-right">
        <img src="/images/spider.png" alt="spider" />
      </div>

      <div className="home-container">
        {/* 로고 */}
        <div className="home-logo">
          <img src="/images/logo.png" alt="logo" />
        </div>

        <div className="home-content">
          {/*<h1 className="home-title">
            Public <br />
            HR <br />
            Analytics
          </h1>*/}

          <button
            className="home-login-button"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </div>

        <GallerySlider />

        <div className="home-footer">
          공공기관 HR 이탈 예측 및 조직 건강도 분석 플랫폼
        </div>
      </div>
    </>
  );
}

export default Home;
