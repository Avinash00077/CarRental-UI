import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

const CarItem = ({
  id,
  name,
  price,
  description,
  image,
  brand,
  userSelectedDates,
  availability,
  daily_rent,
  model_year,
  registration_number,
  image_ext,
  location,
  car_reviews,
  onBookNow,
}) => {
  const [carsLeft, setCarsLeft] = useState(5);
  const [carReviews , setCarReviews] = useState([])
  const [openReviewModal,setOpenReviewModal] = useState(false);
  console.log(car_reviews," Inside Car Review" )
  const carReview = () => {
    let reviews = car_reviews && car_reviews?.length > 0 ? car_reviews : []
    setCarReviews(reviews)
  }
  useEffect(() => {
    carReview();
    setCarsLeft(Math.floor(Math.random() * 6) + 1);
  }, []);

  const onBookNowClick = (id) => {
    console.log(id, model_year, registration_number, daily_rent);
    onBookNow(id);
  };

  const handleOpenReview = ()=>{
    console.log("On Image click")
  }
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
      
                  <h2 className="text-xl font-bold mb-4">{brand} {name} Car Reviews</h2>
      
                  {/* Reviews */}
                  {carReviews?.length > 0 ? (
                    carReviews.map((review, index) => (
                      <div key={index} className="p-4 border-b border-gray-300">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.profile_img_url}
                            alt={review.user_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{review.user_name}</p>
                            <p className="text-sm text-gray-500">{review.created_at}</p>
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
    <div>   
       <div className="max-w-sm rounded-2xl p-6 pb-3 mx-2 my-2.5 h-[350px] overflow-hidden shadow-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-transform duration-300 mr-10">
      <div className="relative">
        {/* Cars Left
        <p className="text-right font-semibold text-[#121212]">
          {carsLeft}+ Cars Left
        </p> */}

        {/* Car Brand and Name */}
        <p className="text-lg font-semibold text-center text-gray-800 mt-2">
          {brand} {name}
        </p>

        {/* Car Image */}
        <div className="flex items-center justify-center mt-4">
          <img
            src={image}
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
            <span className="font-semibold text-gray-800 text-xl">₹</span> RS{" "}
            {daily_rent}
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
            onClick={ () => setOpenReviewModal(true)}
          />
          <button
            className="w-[140px] py-2 text-sm bg-[#121212] cursor-pointer font-medium text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#121212] hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
            onClick={() => onBookNowClick(id)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div></div>
    </div>
  );
};

export default CarItem;
