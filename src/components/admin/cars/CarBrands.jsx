import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { useScreenSize } from "../../../context/screenSizeContext";

const { isScreenSize } = useScreenSize;

const CarBrands = () => {
  const [cars, setCars] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  useEffect(() => {
    fetchCarBrands();
  }, []);

  
  const fetchCarBrands = async () => {
    try {
        console.log("i am called")
      setIsLoaderOpen(true);
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/car-brands`,
        {
          headers: {
            Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
          },
        }
      );

      setCars(response.data.data);
      setIsLoaderOpen(false);
    } catch (error) {
        console.log(error)
      setIsLoaderOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {isLoaderOpen && <Loader />}
      {cars?.length > 0 ? (
        <div
          className={`${
            isScreenSize ? "h-[90vh] " : "h-[98vh] "
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            Car Brand
          </h1>
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
                    Seater
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4">{car.car_brand}</td>
                    <td className="px-6 py-4">{car.car_name} </td>
                    <td className="px-6 py-4">{car.car_type}</td>
                    <td className="px-6 py-4">{car.car_modal_year} </td>
                    <td className="px-6 py-4">{car.seater} </td>
                    <td className="px-6 py-4">
                      {car.activeInd === "Y" ? "Active" : "Inactive"}{" "}
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        key={car.car_id}
                        style={{
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        onClick={() => {
                          setSelectedBooking({
                            ...car,
                          });
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
      ) : (
        <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
          No Cars avilable
        </h1>
      )}
    </div>
  );
};

export default CarBrands;
