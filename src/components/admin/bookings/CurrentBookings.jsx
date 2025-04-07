import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import { useScreenSize } from "../../../context/screenSizeContext";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { getUserToken } from "../../../utils/getToken";
import CarUploadModal from "../componnets/CarUploadModal";
const { isScreenSize } = useScreenSize;

const CurrentBookings = () => {
  const [bookings, setBookings] = useState([]);
    const [currentTabState, setCurrentTab] = useState("ongoing");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [uploadCarDeatilsOpen, setOpenUploadCarDetails] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [startKm, setStartKm] = useState("");
  const [images, setImages] = useState({
    car_image_front: {
      file: null,
      preview:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1zwhySGCEBxRRFYIcQgvOLOpRGqrT3d7Qng&s",
      status: "default",
    },
    car_image_back: {
      file: null,
      preview:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1zwhySGCEBxRRFYIcQgvOLOpRGqrT3d7Qng&s",
      status: "default",
    },
    car_image_side_1: {
      file: null,
      preview:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1zwhySGCEBxRRFYIcQgvOLOpRGqrT3d7Qng&s",
      status: "default",
    },
    car_image_side_2: {
      file: null,
      preview:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1zwhySGCEBxRRFYIcQgvOLOpRGqrT3d7Qng&s",
      status: "default",
    },
  });
  const adminAuthToken = localStorage.getItem("adminAuthToken");

  const handlePickup = async (bookingId) => {
    try {
      setIsLoaderOpen(true);

      // Create a FormData object
      const formData = new FormData();
      formData.append("booking_id", bookingId);
      formData.append("startKm", startKm);

      // Append images if they exist
      Object.entries(images).forEach(([key, value]) => {
        if (value.file) {
          formData.append(key, value.file); // Attach actual file, not object
        }
      });

      // Make API call with FormData
      await axios.put(
        `${constants.API_BASE_URL}/admin/booking/pickup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminAuthToken}`,
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );
      setIsLoaderOpen(false);
      setSelectedBooking(null);
      fetchCurrentBookings();
    } catch (error) {
      setIsLoaderOpen(false);
      console.error("Pickup failed", error);
    }
  };

  const handleDrop = async (bookingId) => {
    try {
      setIsLoaderOpen(true);
      await axios.put(
        `${constants.API_BASE_URL}/admin/booking/drop`,
        { booking_id: bookingId },
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` },
        }
      );
      alert("Ride completed!");
      setIsLoaderOpen(false);
      setSelectedBooking(null);
      fetchCurrentBookings();
    } catch (error) {
      setIsLoaderOpen(false);
      console.error("Drop failed", error);
    }
  };

  const removeImage = (key) => {
    setImages((prev) => ({
      ...prev,
      [key]: { file: null, preview: `/default-${key}.jpg`, status: "default" },
    }));
  };
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      const file = files[0];
      setImages((prev) => ({
        ...prev,
        [name]: { file, preview: URL.createObjectURL(file), status: "pending" },
      }));
    }
  };
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${constants.API_BASE_URL}/admin/bookings`,{
        headers:{
          type: currentTabState,
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAuthToken}`,
        }
      })
      if (response.status === 200) {
        setBookings(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchBookings();
  },[currentTabState])


  return (
    <div className="flex items-center justify-center ml-[10%]">
      {isLoaderOpen && <Loader />}
      {uploadCarDeatilsOpen && (
        <div className="fixed inset-0   flex items-center justify-center z-[999]">
          <div
            className="bg-white  relative rounded-2xl shadow-2xl w-full max-w-xs h-auto mx-4 md:mx-0 p-8 space-y-8"
            style={{ padding: "20px" }}
          >
            {/* onClick={closeModal}> */}
            <div className="flex justify-end">
              <span className="material-icons cursor-pointer">X</span>
            </div>
            <div className="inset-0 flex text-medium items-center justify-center text-center z-10">
              Hello SUhdeer
            </div>
          </div>
        </div>
      )}
        <div
          className={`${
            isScreenSize ? "h-[90vh] " : "h-[98vh] "
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            Current Bookings
          </h1>
          <div className="mt-6 flex justify-start items-center space-x-3">
        {["ongoing","future","past"].map((item) => (
          <button
            className={`text-lg font-semibold ${
              currentTabState == item ? " border-b-2" : " text-gray-600"
            } cursor-pointer  `}
            onClick={() => setCurrentTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {bookings?.length > 0 ? (
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
                    <td className="px-6 py-4">{bookings.ride_status} </td>
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
                            ...bookings,
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
      ) : (
        <div className="w-full h-screen  flex justify-center mt-30">
          <h1 className="font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white mb-10 align-middle">
            Currently there are no bookings
          </h1>
        </div>
      )}
       </div>

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
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>

            {/* Left: Car Image */}
            <div className="w-full md:w-1/2">
              {/* <img
                src={selectedBooking.car_cover_img_url}
                alt={selectedBooking.car_name}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              /> */}

              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.keys(images).map((key) => (
                  <div key={key} className="relative">
                    <label className="block text-gray-700 font-medium mb-1">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>

                    <input
                      type="file"
                      name={key}
                      className="hidden"
                      id={key}
                      onChange={handleFileChange}
                    />
                    <label htmlFor={key} className="cursor-pointer block">
                      <img
                        src={images[key].preview}
                        alt={key}
                        className="w-full h-40 object-cover rounded-md border"
                      />
                    </label>

                    {images[key].status !== "default" && (
                      <button
                        onClick={() => removeImage(key)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Booking Details */}
            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                Bookings For {selectedBooking.booking_id}
              </h2>
              <div className="my-4 space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedBooking.car_name}
                </h2>
                <div className="flex lg:flex-col space-x-5">
                  <p className="text-gray-700">
                    <strong>Brand:</strong> {selectedBooking.brand}
                  </p>
                  <p className="text-gray-700">
                    <strong>Model Year:</strong> {selectedBooking.model_year}
                  </p>
                </div>
                <p className="text-gray-700 ">
                  <strong>Car Description:</strong>{" "}
                  <span className="text-center">
                    {selectedBooking.model_year}
                  </span>
                </p>
                <div className="w-full">
                  <label className="block text-sm mb-1">Start KiloMeters</label>
                  <input
                    type="text"
                    name="lastName"
                    value={startKm}
                    onChange={(e) => setStartKm(e.target.value)}
                    placeholder="Enter Start Km"
                    className={`w-full text-sm  ${"border bg-white rounded-lg hover:bg-gray-50"}  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                    style={{ padding: "8px", margin: "4px 0px" }}
                  />
                </div>
              </div>

              <div className=" space-x-6 flex justify-center items-center">
                <button
                  className={`mt-4 w-full px-4 py-2 rounded-md font-semibold transition
    ${
      images.car_image_back.file &&
      images.car_image_front.file &&
      images.car_image_side_1.file &&
      images.car_image_side_2.file&&
      !startKm ==""
        ? "bg-black text-white hover:scale-105 cursor-pointer"
        : "bg-gray-400 text-gray-700 cursor-not-allowed"
    }`}
                  onClick={() => handlePickup(selectedBooking.booking_id)}
                  disabled={
                    !images.car_image_back.file ||
                    !images.car_image_front.file ||
                    !images.car_image_side_1.file ||
                    !images.car_image_side_2.file||
                    !startKm==""
                  }
                >
                  Confirm Pickup
                </button>
                {selectedBooking.booking_status === "CONFIRMED" &&
                  selectedBooking.ride_status === "ON_GOING" && (
                    <button
                      className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md font-semibold hover:scale-105 transition"
                      onClick={() => handleDrop(selectedBooking.booking_id)}
                    >
                      Confirm Drop
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBookings;
