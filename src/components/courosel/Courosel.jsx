import React from "react";
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import Slider from "react-slick";
import { useScreenSize } from "../../context/screenSizeContext";
import "./Courosel.css";

const Courosel = () => {
  const { isScreenSmall } = useScreenSize();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Disable previous/next arrows
  };

  return (
    <div
      className={`main mt-10  rounded-xl ${
        isScreenSmall ? "h-[200px]" : "h-[500px]"
      }`}
    >
      <div className="carousel-container h-3/4">
        <Slider {...settings}>
          <div>
            <img
              className={`w-full ${
                isScreenSmall ? "h-[200px]" : "h-[500px]"
              } rounded-xl`}
              src="https://ideogram.ai/assets/progressive-image/balanced/response/efRj0Q6lT820C3GM8MclEg"
              alt="slide 1"
            />
          </div>
          <div>
            <img
              className={`w-full ${
                isScreenSmall ? "h-[200px]" : "h-[500px]"
              } rounded-xl`}
              src="https://ideogram.ai/assets/progressive-image/balanced/response/D17ZC5YvSWSNgStjrg6JzQ"
              alt="slide 2"
            />
          </div>
          <div>
            <img
              className={`w-full ${
                isScreenSmall ? "h-[200px]" : "h-[500px]"
              } rounded-xl`}
              src="https://ideogram.ai/assets/progressive-image/balanced/response/W7X5prHTQj-qtTViaguc4Q"
              alt="slide 3"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Courosel;
