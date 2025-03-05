import React from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import Slider from "react-slick";
import { useScreenSize } from "../../context/screenSizeContext";
import { getUserToken } from "../../utils/getToken";
import car50 from "../../assets/car_50.png";
import "./Courosel.css";

const Courosel = () => {
  const { isScreenSmall } = useScreenSize();
  const navigate = useNavigate();
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

  const authToken = getUserToken();
  const location = localStorage.getItem("location") || 'Hyderabad';
  console.log()
  const handleImageClick = () => {
    // Get current date
    const today = new Date();

    // Format to YYYY-MM-DD
    const pickUpDate = today.toISOString().split("T")[0];
    const pickUpTime = "10:00";
    // Calculate drop-off date (6 days from today)
    const dropOffDate = new Date();
    dropOffDate.setDate(today.getDate() + 30);
    const dropOffTime = "10:00";
    const formattedDropOffDate = dropOffDate.toISOString().split("T")[0];

    if (authToken && location) {
      navigate(
        `/viewCars?pickUpDate=${pickUpDate}&toDate=${formattedDropOffDate}&location=${location}&pickupTime=${pickUpTime}&dropoffTime=${dropOffTime}`
      );
    } else {
      window.location.href = "/auth";
    }
  };

  return (
    <div
      className={`main mt-10 w-full  rounded-xl ${
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
              onClick={() => handleImageClick()}
            />
          </div>
          <div>
            <img
              className={`w-full ${
                isScreenSmall ? "h-[200px]" : "h-[500px]"
              } rounded-xl`}
              src={car50}
              alt="slide 2"
              onClick={() => handleImageClick()}
            />
          </div>
          <div>
            <img
              className={`w-full ${
                isScreenSmall ? "h-[200px]" : "h-[500px]"
              } rounded-xl`}
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/car-sale-banner-design-template-f3025e019370db68e4ddb97ae9a10178_screen.jpg?ts=1639355203"
              alt="slide 3"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Courosel;
