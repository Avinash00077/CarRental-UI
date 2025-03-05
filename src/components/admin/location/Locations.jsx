import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { useScreenSize } from "../../../context/screenSizeContext";

const { isScreenSize } = useScreenSize;

const Locations = () => {
  const [locations, setLocations] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  
  const fetchLocations = async () => {
    try {
        console.log("i am called")
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/locations`,
        {
          headers: {
            Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
          },
        }
      );

      setLocations(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {

      setIsLoaderOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {isLoaderOpen && <Loader />}
      {locations?.length > 0 ? (
        <div
          className={`${
            isScreenSize ? "h-[90vh] " : "h-[98vh] "
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            Locations
          </h1>
          <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                  {/* <th scope="col" className="px-6 py-3">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4">{location.location}</td>
                    <td className="px-6 py-4">{location.address} </td>
                    <td className="px-6 py-4">
                      {location.activeInd === "Y" ? "Active" : "Inactive"}{" "}
                    </td>

                    {/* <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        key={location.location_id}
                        style={{
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        onClick={() => {
                          setSelectedBooking({
                            ...location,
                          });
                        }}
                      >
                        Edit
                      </a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
          No Locations avilable
        </h1>
      )}
    </div>
  );
};

export default Locations;
