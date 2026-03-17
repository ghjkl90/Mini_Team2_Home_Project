import { useEffect } from "react";
import Swiper from "swiper";
import { Autoplay, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import { gsap } from "gsap";
import "../styles/gallery.css";

function GallerySlider() {
  useEffect(() => {
    const slider = new Swiper(".swiper-container", {
      modules: [Autoplay, Mousewheel, FreeMode],

      slidesPerView: "auto",
      spaceBetween: 150,
      centeredSlides: true,

      loop: true,

      speed: 6000,

      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },

      freeMode: true,
      freeModeMomentum: false,

      mousewheel: true,
      grabCursor: true,
    });

    slider.on("slideChange", function () {
      gsap.to(".slide-title span", {
        duration: 0.3,
        y: "-100px",
      });
    });
  }, []);

  return (
    <div className="wrapper">
      <main className="swiper-container">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="slide-number">
              <p>
                <span>003</span>
              </p>
            </div>

            <div className="slide-title">
              <h4>
                <span>Street01</span>
              </h4>
            </div>

            <div className="slide-img img1"></div>
          </div>

          <div className="swiper-slide">
            <div className="slide-number">
              <p>
                <span>004</span>
              </p>
            </div>

            <div className="slide-title">
              <h4>
                <span>Street02</span>
              </h4>
            </div>

            <div className="slide-img img2"></div>
          </div>

          <div className="swiper-slide">
            <div className="slide-number">
              <p>
                <span>002</span>
              </p>
            </div>

            <div className="slide-title">
              <h4>
                <span>Street03</span>
              </h4>
            </div>

            <div className="slide-img img3"></div>
          </div>

          <div className="swiper-slide">
            <div className="slide-number">
              <p>
                <span>001</span>
              </p>
            </div>

            <div className="slide-title">
              <h4>
                <span>Street04</span>
              </h4>
            </div>

            <div className="slide-img img4"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GallerySlider;
