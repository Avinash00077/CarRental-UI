import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { useScreenSize } from "../../../context/screenSizeContext";

const CarBrands = () => {
  const { isScreenSize } = useScreenSize();
  const [cars, setCars] = useState([]);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    car_brand: "",
    car_name: "",
    car_type: "",
    seater: "",
    car_modal_year: "",
    activeInd: "Y",
  });

  useEffect(() => {
    fetchCarBrands();
  }, []);

  const fetchCarBrands = async () => {
    try {
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/car-brands`,
        {
          headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
        }
      );
      setCars(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoaderOpen(false);
    }
  };

  // Handle Add or Update Car
  const handleAddOrUpdateCar = async (e) => {
    e.preventDefault();
    try {
      setIsLoaderOpen(true);
      if (editMode) {
        formData.car_id = selectedCar.car_id;
        await axios.put(
          `${constants.API_BASE_URL}/admin/car-brands/`,
          formData,
          {
            headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
          }
        );
      } else {
        await axios.post(
          `${constants.API_BASE_URL}/admin/car-brands`,
          formData,
          {
            headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
          }
        );
      }
      fetchCarBrands();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaderOpen(false);
    }
  };

  // Open Modal for Add or Edit
  const openModal = (car = null) => {
    if (car) {
      setEditMode(true);
      setSelectedCar(car);
      setFormData({ ...car });
    } else {
      setEditMode(false);
      setSelectedCar(null);
      setFormData({
        car_brand: "",
        car_name: "",
        car_type: "",
        seater: "",
        car_modal_year: "",
        activeInd: "Y",
      });
    }
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedCar(null);
  };

  return (
    <div className="flex items-center justify-center">
      {isLoaderOpen && <Loader />}
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-20 mb-10">
          Car Brands
        </h1>
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => openModal()}
        >
          Add New Car
        </button>
        <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Car Brand</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Model Year</th>
                <th className="px-6 py-3">Seater</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.car_id} className="border-b dark:border-gray-700">
                  <td className="px-6 py-4">{car.car_brand}</td>
                  <td className="px-6 py-4">{car.car_name}</td>
                  <td className="px-6 py-4">{car.car_type}</td>
                  <td className="px-6 py-4">{car.car_modal_year}</td>
                  <td className="px-6 py-4">{car.seater}</td>
                  <td className="px-6 py-4">
                    {car.activeInd === "Y" ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openModal(car)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center border-2 border-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Car" : "Add Car"}
            </h2>
            <form onSubmit={handleAddOrUpdateCar}>
              <label className="block text-sm font-medium text-gray-700">
                Car Brand
              </label>
              <input
                type="text"
                value={formData.car_brand}
                onChange={(e) =>
                  setFormData({ ...formData, car_brand: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.car_name}
                onChange={(e) =>
                  setFormData({ ...formData, car_name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <input
                type="text"
                value={formData.car_type}
                onChange={(e) =>
                  setFormData({ ...formData, car_type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Model Year
              </label>
              <input
                type="number"
                value={formData.car_modal_year}
                onChange={(e) =>
                  setFormData({ ...formData, car_modal_year: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Seater
              </label>
              <input
                type="number"
                value={formData.seater}
                onChange={(e) =>
                  setFormData({ ...formData, seater: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              {editMode &&(
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.activeInd}
                  onChange={(e) =>
                    setFormData({ ...formData, activeInd: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md mb-2"
                >
                  <option value="Y">Active</option>
                  <option value="N">Inactive</option>
                </select>
              </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarBrands;
