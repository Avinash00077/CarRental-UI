import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import { useScreenSize } from "../../../context/screenSizeContext";
import Loader from "../../Loader/Loader";
import axios from "axios";

const { isScreenSize } = useScreenSize;

const CurrentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [otp, setOtp] = useState(null);
  const adminAuthToken = localStorage.getItem("adminAuthToken");

  useEffect(() => {fetchCurrentBookings()}, []);

  const fetchCurrentBookings = async () => {
    try {
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${adminAuthToken}`,
          },
        }
      );

      setBookings(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {
      setIsLoaderOpen(false);
    }
  };
  console.log(selectedBooking)

  return (
    <div className="flex items-center justify-center">
      {isLoaderOpen && <Loader />}
      {bookings?.length > 0 ? (
        <div
          className={`${
            isScreenSize ? "h-[90vh] " : "h-[98vh] "
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            Current Bookings
          </h1>
          <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    BookingId
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Car
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Booking Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ride Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((bookings) => (
                  <tr
                    key={bookings.booking_id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4">{bookings.booking_id}</td>
                    <td className="px-6 py-4">{bookings.name} </td>
                    <td className="px-6 py-4">{bookings.email} </td>
                    <td className="px-6 py-4">{bookings.car_name} </td>
                    <td className="px-6 py-4">{bookings.start_date} </td>
                    <td className="px-6 py-4">{bookings.end_date} </td>
                    <td className="px-6 py-4">{bookings.booking_status} </td>
                    <td className="px-6 py-4">{bookings.booking_status} </td>
                    <td className="px-6 py-4">
                      
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        key={bookings.booking_id}
                        style={{
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        onClick={() => {
                            setSelectedBooking({
                            ...bookings
                          });
                        }}
                      >
                        View
                      </a>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen  flex justify-center items-center">
          <h1 className="font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white mt-20 mb-10 align-middle">
            Currently there are no bookings
          </h1>
        </div>
      )}

      {selectedBooking?.booking_id && (
        <div
          className={`${
            isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
          } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
            {/* Close Button */}
            <button
              className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-as transition"
              onClick={() => selectedBooking(null)}
            >
              ✕
            </button>

            {/* Left: Car Image */}
            <div className="w-full md:w-1/2">
              <img
                src={selectedBooking.car_cover_img_url}
                alt={selectedBooking.car_name}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Right: Booking Details */}
            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
               Bookings For {selectedBooking.booking_id}
              </h2>
                
              <div className=" space-x-6 flex justify-center items-center">
                <button
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                  onClick={() =>
                    handleStatus(selectedBooking.booking_id, "Y", "aadhar")
                  }
                >
                  Complete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CurrentBookings;
