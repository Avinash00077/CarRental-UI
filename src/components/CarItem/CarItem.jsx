import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdDirectionsWalk } from "react-icons/md";
import { assets } from "../../assets/assets";

const CarItem = ({ car, onBookNow }) => {
  const [carsLeft, setCarsLeft] = useState(5);
  const [carReviews, setCarReviews] = useState([]);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const carReview = () => {
    let reviews =
      car.car_reviewscar_reviews && car.car_reviewscar_reviews?.length > 0
        ? car.car_reviewscar_reviews
        : [];
    setCarReviews(reviews);
  };
  useEffect(() => {
    carReview();
    setCarsLeft(Math.floor(Math.random() * 6) + 1);
  }, []);

  const onBookNowClick = (id) => {
    onBookNow(id);
  };

  const handleOpenReview = () => {
    console.log("On Image click");
  };
  return (
    <div>
      {openReviewModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] h-[400px] max-w-3xl  rounded-lg p-6 shadow-lg relative overflow-scroll">
            {/* Close Button */}
            <button
              onClick={() => setOpenReviewModal(false)}
              className="absolute top-3 right-3 text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              {brand} {name} Car Reviews
            </h2>

            {/* Reviews */}
            {car.car_reviewscarReviews?.length > 0 ? (
              car.car_reviewscarReviews.map((review, index) => (
                <div key={index} className="p-4 border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.profile_img_url}
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review.user_name}</p>
                      <p className="text-sm text-gray-500">
                        {review.created_at}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-yellow-500">⭐ {review.rating}/5</p>
                  <p className="mt-1">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      )}
      {false && (
        <div>
          <div className="max-w-sm rounded-2xl p-6 pb-3 mx-2 my-2.5 h-[350px] overflow-hidden shadow-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-transform duration-300 mr-10">
            <div className="relative">
              {/* Cars Left
        <p className="text-right font-semibold text-[#121212]">
          {carsLeft}+ Cars Left
        </p> */}

              {/* Car Brand and Name */}
              <p className="text-lg font-semibold text-center text-gray-800 mt-2">
                {car.brand} {car.name}
              </p>

              {/* Car Image */}
              <div className="flex items-center justify-center mt-4">
                <img
                  src={car.image}
                  alt="Car"
                  className="w-full h-36 object-cover rounded-xl cursor-pointer"
                  onClick={() => onBookNowClick(id)}
                />
              </div>
            </div>

            {/* Pricing and Rating Section */}
            <div className="mt-6 flex justify-between items-start">
              {/* Pricing Details */}
              <div className="flex flex-col items-start">
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-800 text-xl">₹</span>{" "}
                  RS {car.daily_rent}
                </p>
                <p className="text-gray-500 text-xs mt-1">(179 KM included)</p>
                <p className="text-gray-500 text-xs mt-1">Excess ₹ 3.5/km</p>
              </div>

              {/* Rating and Book Now Button */}
              <div className="flex flex-col items-center">
                <img
                  src={assets.rating_starts}
                  alt="Rating"
                  className="w-20 h-4 mb-2 cursor-pointer"
                  onClick={() => setOpenReviewModal(true)}
                />
                <button
                  className="w-[140px] py-2 text-sm bg-[#121212] cursor-pointer font-medium text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#121212] hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
                  onClick={() => onBookNowClick(car.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        <div
          className="bg-white rounded-lg shadow-md p-3 w-80 hover:cursor-pointer"
          onClick={() => onBookNowClick(car.car_id)}
        >
          <img
            src={car.car_cover_img_url}
            alt={car.name}
            className="w-full h-44 object-cover rounded-lg"
          />
          <div className="p-2">
            {/* Rating & Trips */}
            <div className="flex items-center space-x-2 text-sm text-white bg-black px-2 py-1 w-fit rounded-md">
              <FaStar className="text-yellow-400" />
              <span>4.57</span>
              <span> | 15 Trips</span>
            </div>

            {/* Car Details */}
            <h2 className="text-lg font-semibold mt-2">
              {car.brand} {car.name}
            </h2>
            <p className="text-gray-600 text-sm">{car.model_year}</p>

            {/* Pricing */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-xl font-bold">
                ₹{(car.daily_rent / 24).toFixed(0)}/hr
              </p>
              <p className="text-gray-500 text-sm">
                ₹{car.daily_rent} excluding fees
              </p>
            </div>

            {/* Features */}
            <p className="text-gray-500 text-sm mt-1">
              {"Good"} • {car.car_type} • {car.seater} Seats
            </p>

            {/* Location */}
            <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
              <MdDirectionsWalk />
              <span>3.8 km away</span>
            </div>

            {/* FASTag */}
            {car.fastag_availability === "Y" && (
              <div className="mt-2 bg-gray-200 text-xs font-bold px-2 py-1 w-fit rounded-md">
                ACTIVE FASTAG
              </div>
            )}
            {car.fastag_availability !== "Y" && (
              <div className="mt-2 bg-gray-200 text-xs font-bold px-2 py-1 w-fit rounded-md">
                FASTAG NOT AVILABLE
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default CarItem;
