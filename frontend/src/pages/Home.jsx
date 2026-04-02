import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import "../css/Home.css";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const modules = [
    {
      id: "01",
      title: "Main Home, ID, SignUp Page",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      description:
        "Analyze attrition patterns with high-precision predictive modeling.",
    },
    {
      id: "02",
      title: "Organizational HR Overview",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800",
      description:
        "Real-time tracking of organizational health and team morale.",
    },
    {
      id: "03",
      title: "Employee Risk Prediction",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      description:
        "Benchmark your talent acquisition speed against industry leaders.",
    },
    {
      id: "04",
      title: "API(GET/POST), DB",
      image:
        "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
      description:
        "Identify flight risks before they impact your core operations.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % modules.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [modules.length]);

  return (
    <div className="split-container home-theme-wrapper">
      {/* Left Section: Content */}
      <div className="content-side">
        <header className="side-header">
          <span className="platform-tag">INTERNAL PLATFORM</span>
          <span className="version-tag">v4.2.0</span>
        </header>

        <main className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              PUBLIC <br />
              <span className="text-highlight">HR</span> <br />
              ANALYTICS
            </h1>
            <p className="hero-description">
              기존 시스템은 ‘보여주는 것’에 그치지만, <br />
              우리는 ‘판단을 도와주는 시스템’을 만들었습니다.
            </p>
            <button
              className="login-action-btn"
              onClick={() => navigate("/login")}
            >
              LOGIN TO DASHBOARD
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </main>

        <footer className="side-footer">
          <p>© 2026 PHR ANALYTICS CORP.</p>
          <div className="pagination-dots">
            {modules.map((_, i) => (
              <div
                key={i}
                className={`dot ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </footer>
      </div>

      {/* Right Section: Visual Gallery */}
      <div className="visual-side">
        <div className="gallery-track">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="featured-image-container"
            >
              <img
                src={modules[activeIndex].image}
                alt={modules[activeIndex].title}
                className="featured-image"
              />
              <div className="image-overlay">
                <span className="module-tag">
                  MODULE {modules[activeIndex].id}
                </span>
                <h3 className="module-title">{modules[activeIndex].title}</h3>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="side-cards-stack">
            {modules.map((module, idx) => (
              <div
                key={module.id}
                className={`mini-card ${activeIndex === idx ? "hidden" : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                <img src={module.image} alt="" />
                <div className="mini-card-info">
                  <span className="mini-tag">MODULE {module.id}</span>
                  <p className="mini-title">{module.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
