import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";
import LocationPicker from "../../Location/location";
import { useScreenSize } from "../../../context/screenSizeContext";

const Locations = () => {
  const { isScreenSize } = useScreenSize();
  const [locations, setLocations] = useState([]);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    address: "",
    activeInd: "Y",
  });
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/locations`,
        {
          headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
        }
      );
      setLocations(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setIsLoaderOpen(false);
    }
  };

  const handleAddOrUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      setIsLoaderOpen(true);
      if (editMode) {
        // Update existing location
        formData.location_id = selectedLocationId
        await axios.put(
          `${constants.API_BASE_URL}/admin/locations`,
          formData,
          {
            headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
          }
        );
      } else {
        // Add new location
        await axios.post(
          `${constants.API_BASE_URL}/admin/locations`,
          formData,
          {
            headers: { Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}` },
          }
        );
      }
      setModalOpen(false);
      setEditMode(false);
      setFormData({ location: "", address: "", activeInd: "Y" });
      fetchLocations();
    } catch (error) {
      console.error("Error adding/updating location:", error);
    } finally {
      setIsLoaderOpen(false);
    }
  };

  const openEditModal = (location) => {
    setEditMode(true);
    console.log(location)
    setFormData({
      location: location.location,
      address: location.address,
      activeInd: location.activeInd,
      latitude: location.latitude || "",  // Store latitude from LocationPicker
  longitude: location.longitude || "",
    });
    console.log(formData, '######################################')
    setSelectedLocationId(location.location_id);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {isLoaderOpen && <Loader />}

      {/* Heading & Add Button */}
      <div className="flex justify-between w-full max-w-3xl mt-44 mb-5">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Locations
        </h1>
        <button
          onClick={() => {
            setEditMode(false);
            setModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-md "
        >
          Add Location
        </button>
      </div>

      {/* Locations Table */}
      {locations?.length > 0 ? (
        <div className="overflow-x-auto shadow-md w-full max-w-3xl">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr
                  key={location.location_id}
                  className="border-b dark:border-gray-700 border-gray-200"
                >
                  <td className="px-6 py-4">{location.location}</td>
                  <td className="px-6 py-4">{location.address}</td>
                  <td className="px-6 py-4">
                    {location.activeInd === "Y" ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openEditModal(location)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-10">
          No Locations Available
        </h1>
      )}

      {/* Modal for Add/Edit Location */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-4xl mt-20">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Location" : "Add Location"}
            </h2>
            <form onSubmit={handleAddOrUpdateLocation}>
              <div className="flex w-[100%]  space-x-5">
              <div className="w-[80%]">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                required
              />
              {editMode && (<div>
                <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.activeInd}
                onChange={(e) =>
                  setFormData({ ...formData, activeInd: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              >
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
              </div>)}
              </div>
                       
              <div className="w-full ">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pick Location on Map
                </label>
                <LocationPicker setData={setFormData} initialLatitude={formData.latitude}
        initialLongitude={formData.longitude} />
              </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
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

export default Locations;
