import { useEffect, useState } from "react";
import constants from "../../config/constants";
import axios from "axios";
import user from '../../assets/user.png'

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReview = async () => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/feedback`
      );
      setReviews(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <div className="py-12 bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          What Our Customers Say
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading reviews...</p>
      ) : (
        <div className="relative overflow-hidden mt-6" id="Reviews">
          <div className="flex space-x-6 animate-scroll whitespace-nowrap">
            {reviews.concat(reviews).map((review, index) => (
              <div
                key={index}
                className="w-80 p-4 shadow-md rounded-xl border border-gray-200 flex flex-col flex-shrink-0"
              >
                <div className="flex items-center space-x-0">
                  <img
                    src={review.profile_img_url || user}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-900"
                  />
                  <h2 className="text-sm  font-semibold text-gray-500 pl-2 flex items-center">
                    @{review.user_name}
                    <span className="text-yellow-500 ml-10">
                      {"★".repeat(review.rating)}
                    </span>
                  </h2>
                </div>
                {/* Changed the paragraph styling here */}
                <div className="mt-1 flex-1">
                  <h3>{review.first_name} {review.last_name} </h3>
                  <p className="text-gray-600  mt-2 italic  whitespace-normal break-words">
                    "{review.comments}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
