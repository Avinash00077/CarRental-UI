import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useScreenSize } from "../../../context/screenSizeContext";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";

const AdminCarUpload = () => {
  const isScreenSize = useScreenSize().isScreenSmall;
  const authToken = localStorage.getItem("adminAuthToken");
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [carImage, setCarImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCarOpen, setIsCarOpen] = useState(false);
  const [locationsData, setlocationsData] = useState([]);
  const [isNew, setIsNew] = useState(true);

  if (!authToken) {
    window.location.href = "/";
  }

  useEffect(() => {
    GetCars();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/locations`,
        {
          headers: {
            Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
          },
        }
      );
      let locations = [];

      response.data.data.map((i) => {
        locations.push(i.location);
      });

      setlocationsData(locations);
    } catch (error) {
      setIsLoaderOpen(false);
    }
  };

  const onCarOpen = () => {
    try {
      console.log("ope carr");
      setIsLoaderOpen(true);
      fetchLocations();
      setIsCarOpen(true);
      setIsLoaderOpen(false);
    } catch (error) {
      console.log(error);
      setIsCarOpen(false);
      setIsLoaderOpen(false);
    }
  };
  const fetchImageAsFile = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], "car_image.jpg", { type: blob.type });
  };

  const selectedCarOpen = async (car) => {
    try {
      console.log("ope carr");
      setIsLoaderOpen(true);
      fetchLocations();
      setIsCarOpen(true);
      setCarData(car);
      setPreview(car.car_cover_img_url);
      const imageFile = await fetchImageAsFile(car.car_cover_img_url);
      console.log(imageFile)
      setCarImage(imageFile);
      setIsNew(false);
      setIsLoaderOpen(false);
      console.log(carData)
    } catch (error) {
      console.log(error);
      setIsCarOpen(false);
      setIsNew(false);
      setIsLoaderOpen(false);
    }
  };

  const [carData, setCarData] = useState({
    car_id: null,
    name: "",
    brand: "",
    model_year: "",
    daily_rent: "",
    availability: "Y",
    registration_number: "",
    location: "",
    description: "",
    car_owner: "",
    car_condition: "new",
    mileage: "",
    car_type: "",
    seater: "",
    fastag_availability: "Y",
    location_address: "",
  });

  const GetCars = async () => {
    try {
      console.log("i am called");
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/car/all`,
        {
          headers: {
            Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
          },
        }
      );

      setCars(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoaderOpen(false);
    }
  };

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarImage(file);
      console.log(file)
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", carData.name);
    formData.append("brand", carData.brand);
    formData.append("model_year", carData.model_year);
    formData.append("daily_rent", carData.daily_rent);
    formData.append("availability", carData.availability);
    formData.append("registration_number", carData.registration_number);
    formData.append("location", carData.location);
    formData.append("description", carData.description);
    formData.append("car_owner", carData.car_owner);
    formData.append("car_condition", carData.car_condition);
    formData.append("mileage", carData.mileage);
    formData.append("car_type", carData.car_type);
    formData.append("seater", carData.seater);
    formData.append("fastag_availability", carData.fastag_availability);
    formData.append("location_address", carData.location_address);
    if (carImage) {
      formData.append("car_image", carImage);
    }

    try {
      let response;
      if (isNew) {
        response = await fetch(`${constants.API_BASE_URL}/admin/car`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
      } else {
        formData.append("car_id", carData.car_id)
        response = await fetch(`${constants.API_BASE_URL}/admin/car`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error("Failed to upload car details");
      }

      const result = await response.json();
      console.log("Car uploaded successfully:", result);
      alert("Car uploaded successfully!");
      setCarData({
        name: "",
        brand: "",
        model_year: "",
        daily_rent: "",
        availability: "",
        registration_number: "",
        location: "",
        description: "",
        car_owner: "",
        car_condition: "new",
        mileage: "",
        car_type: "",
        seater: "",
        fastag_availability: "",
        location_address: "",
      });
      setCarImage(null);
      setPreview("");
      setIsCarOpen(false)
    } catch (err) {
      setError(err.message);
      console.error("Error uploading car:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoaderOpen && <Loader />}
      {isCarOpen ? (
        <div
          className="flex justify-center place-content-evenly min-h-screen  p-4"
          style={
            isScreenSize
              ? { paddingTop: "100px", paddingBottom: "100px" }
              : { paddingTop: "80px", paddingBottom: "20px" }
          }
        >
          <div className="w-full max-w-7xl mt-12 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Upload New Car Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex w-full justify-between place-content-evenly">
                <div className="w-8/12">
                  {/* Car Name */}
                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : "flex w-full space-x-6 justify-between place-content-evenly"
                    }`}
                  >
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Car Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter car name"
                        value={carData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>

                    {/* Brand */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        placeholder="Enter brand"
                        value={carData.brand}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>

                    {/* Model Year */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Year
                      </label>
                      <input
                        type="number"
                        name="model_year"
                        placeholder="Enter model year"
                        value={carData.model_year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                                       {/* Car Type */}
                                       <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Car Type
                      </label>
                      <select
                        name="car_type"
                        value={carData.car_type}
                        onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="">Select Car Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : " w-full flex justify-between place-content-evenly space-x-6"
                    }`}
                  >
                    {/* Registration Number */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registration_number"
                        placeholder="Enter registration number"
                        value={carData.registration_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        name="location"
                        value={carData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="">Select Location</option>
                        {locationsData.map((i) => (
                          <option value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    {/* Car Owner */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Car Owner
                      </label>
                      <input
                        type="text"
                        name="car_owner"
                        placeholder="Enter car owner"
                        value={carData.car_owner}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>

                    {/* Mileage */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mileage (km/l)
                      </label>
                      <input
                        type="number"
                        name="mileage"
                        placeholder="Enter mileage"
                        value={carData.mileage}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                  </div>

                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : " w-full space-x-6 flex justify-between place-content-evenly"
                    }`}
                  >

                     {/* Daily Rent */}
                     <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Daily Rent
                      </label>
                      <input
                        type="number"
                        name="daily_rent"
                        placeholder="Enter daily rent"
                        value={carData.daily_rent}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                    {/* Seater */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seater
                      </label>
                      <input
                        type="number"
                        name="seater"
                        placeholder="Enter number of seats"
                        value={carData.seater}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>

                    {/* Fastag Availability */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fastag Availability
                      </label>
                      <select
                        name="fastag_availability"
                        value={carData.fastag_availability}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>
                    {/* Location Address */}
                    <div className="w-3/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Address
                      </label>
                      <input
                        type="text"
                        name="location_address"
                        placeholder="Enter location address"
                        value={carData.location_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : "flex justify-between place-content-evenly"
                    }`}
                  >
                    {/* Description */}
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Enter car description"
                        rows={4}
                        value={carData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {/* Image Upload */}
                  <div className="w-4/12">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Image
                    </label>
                    <div className="flex flex-col place-content-evenly justify-center items-center border-2 border-dashed border-gray-300 rounded-md w-2xs">
                      <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-2">
                        Upload your car image here
                      </p>
                      <input
                        type="file"
                        name="car_image"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-[#121212] text-white rounded-md cursor-pointer hover:bg-[#121212]"
                      >
                        Choose File
                      </label>
                      {preview && (
                        <img
                          src={preview}
                          alt="Car Preview"
                          className="mt-4 w-2xs h-40 rounded-md object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-end justify-end w-full mt-10 space-x-5">
                    <button
                      className="w-6/12  bg-[#121212] text-white py-2 rounded-md hover:bg-[#121212]"
                      onClick={() => {
                        setIsCarOpen(false);
                        setCarData({})
                        setPreview(null)
                        setCarImage(null)
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-6/12  bg-[#121212] text-white py-2 rounded-md hover:bg-[#121212]"
                    >
                      {loading ? "Uploading..." : "Upload Car"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <div
            className={`${
              isScreenSize ? "h-[90vh] " : "h-[98vh] "
            } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
          >
            <div className="flex w-7xl items-center justify-between">
              {" "}
              <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
                Cars
              </h1>
              <button
                className="mt-30 bg-[#121212] p-2 px-8 cursor-pointer text-gray-100 hover:-translate-y-1 rounded-lg"
                onClick={() => {
                  onCarOpen();
                }}
              >
                Add Car
              </button>
            </div>
            <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Car Brand
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Model Year
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                      <td className="px-6 py-4">{car.brand}</td>
                      <td className="px-6 py-4">{car.name} </td>
                      <td className="px-6 py-4">{car.car_type}</td>
                      <td className="px-6 py-4">{car.model_year} </td>
                      <td className="px-6 py-4">
                        {car.availability === "Y" ? "Avilable" : "Not Avilable"}{" "}
                      </td>
                      <td className="px-6 py-4">{car.location}</td>

                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="font-medium text-[#121212] dark:text-blue-500 hover:underline"
                          key={car.car_id}
                          style={{
                            cursor: "pointer",
                            transition: "background 0.3s",
                          }}
                          onClick={() => {
                            selectedCarOpen(car);
                          }}
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarUpload;
