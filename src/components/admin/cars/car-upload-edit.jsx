import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useScreenSize } from "../../../context/screenSizeContext";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";


const AdminCarUpload = () => {
    const [isLoggedInUser,setIsLoggedInUser]= useState(true)
  const isScreenSize = useScreenSize().isScreenSmall;
  const authToken = localStorage.getItem("adminAuthToken");
  if(!authToken){
    window.location.href = "/";
  }
  const locationsData = [
    "Hyderbad",
    "Delhi",
    "Chennai",
    "Bangalore",
    "Gujarat",
    "Kolkata",
  ];

  const [carData, setCarData] = useState({
    name: "",
    brand: "",
    model_year: "",
    daily_rent: "",
    availability: "N",
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

  const [carImage, setCarImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarImage(file);
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
      const response = await fetch(`${constants.API_BASE_URL}/admin/car`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

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
        availability: "N",
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
      })
      setCarImage(null)
      setPreview("")
    } catch (err) {
      setError(err.message);
      console.error("Error uploading car:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
   authToken &&<div
      className="flex justify-center place-content-evenly min-h-screen  p-4"
      style={
        isScreenSize
          ? { paddingTop: "100px", paddingBottom: "100px" }
          : { paddingTop: "80px", paddingBottom: "20px" }
      }
    >
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Upload New Car Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car Name */}
          <div
            className={`${
              isScreenSize ? "" : "flex justify-between place-content-evenly"
            }`}
          >
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter car name"
                value={carData.name}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Brand */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                placeholder="Enter brand"
                value={carData.brand}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Model Year */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model Year
              </label>
              <input
                type="number"
                name="model_year"
                placeholder="Enter model year"
                value={carData.model_year}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div
            className={`${
              isScreenSize ? "" : "flex justify-between place-content-evenly"
            }`}
          >
            {/* Daily Rent */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rent
              </label>
              <input
                type="number"
                name="daily_rent"
                placeholder="Enter daily rent"
                value={carData.daily_rent}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Registration Number */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                name="registration_number"
                placeholder="Enter registration number"
                value={carData.registration_number}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Location */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                value={carData.location}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Location</option>
             {locationsData.map((i)=> (<option value={i}>{i}</option>))}
             </select>
            </div>
          </div>

          <div
            className={`${
              isScreenSize ? "" : "flex justify-between place-content-evenly"
            }`}
          >
            {/* Car Owner */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Owner
              </label>
              <input
                type="text"
                name="car_owner"
                placeholder="Enter car owner"
                value={carData.car_owner}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Mileage */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage (km/l)
              </label>
              <input
                type="number"
                name="mileage"
                placeholder="Enter mileage"
                value={carData.mileage}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Car Type */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Type
              </label>
              <select
                name="car_type"
                value={carData.car_type}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              isScreenSize ? "" : "flex justify-between place-content-evenly"
            }`}
          >
            {/* Seater */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seater
              </label>
              <input
                type="number"
                name="seater"
                placeholder="Enter number of seats"
                value={carData.seater}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Fastag Availability */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fastag Availability
              </label>
              <select
                name="fastag_availability"
                value={carData.fastag_availability}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
            {/* Location Address */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Address
              </label>
              <input
                type="text"
                name="location_address"
                placeholder="Enter location address"
                value={carData.location_address}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div
            className={`${
              isScreenSize ? "" : "flex justify-between place-content-evenly"
            }`}
          >
            {/* Description */}
            <div style={{ padding: "10px", margin: "10px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter car description"
                value={carData.description}
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div style={{ padding: "10px", margin: "10px" }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Image
            </label>
            <div className="flex flex-col place-content-evenly justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
              <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">Upload your car image here</p>
              <input
                type="file"
                name="car_image"
                style={{ padding: "10px", margin: "10px" }}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                style={
                  isScreenSize
                    ? {
                        padding: "10px",
                        margin: "10px",
                        width: "200px",
                        marginLeft: "100px",
                      }
                    : {
                        padding: "10px",
                        margin: "10px",
                        width: "500px",
                        marginLeft: "180px",
                      }
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Choose File
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Car Preview"
                  className="mt-4 rounded-md object-cover"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={
              isScreenSize
                ? {
                    padding: "10px",
                    margin: "10px",
                    width: "200px",
                    marginLeft: "100px",
                  }
                : {
                    padding: "10px",
                    margin: "10px",
                    width: "500px",
                    marginLeft: "180px",
                  }
            }
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "Uploading..." : "Upload Car"}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminCarUpload;
