import React from "react";
import carCrash from "../../assets/car-crash.gif";
import successCar from "../../assets/convertible-car.gif";

const Modal = ({ typeOfModal, message, closeModal, onConfirm }) => {
  return (
    <>
      {typeOfModal === "failure" && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div
            className="bg-white  relative rounded-2xl shadow-2xl w-full max-w-xs h-auto mx-4 md:mx-0 p-8 space-y-8"
            style={{ padding: "20px" }}
          >
            <div className="flex justify-end" onClick={closeModal}>
              <span className="material-icons cursor-pointer">X</span>
            </div>
            <div className="flex items-center justify-center">
              <img src={carCrash} alt="Error" className="h-36 w-36" />
            </div>
            <div className="inset-0 flex text-medium items-center justify-center text-center z-10">
              {message}
            </div>
          </div>
        </div>
      )}

      {typeOfModal === "success" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="relative rounded-lg shadow-2xl w-full max-w-sm h-56 mx-4 md:mx-0 p-8 space-y-8"
            //style={{ padding: "20px" }}
          >
            <div className="flex items-center justify-center">
              <img src={successCar} alt="Success" className="h-28 w-28" />
            </div>
            <div className="inset-0 flex items-center justify-center text-center z-10 overflow-auto">
              <p className="text-lg font-sm text-black break-words pb-6">
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
      {typeOfModal === "confirmation" && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="bg-white  relative backdrop-opacity-95 rounded-lg shadow-2xl w-full max-w-[80%] md:max-w-[25%] h-52 mx-4 md:mx-0 p-6 md:p-8 space-y-6 md:space-y-8"
              //style={{ padding: "20px" }}
            >
              <h2 className="text-center text-xl font-semibold">
                Confirm Logout
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to log out?
              </p>
              <div
                className="flex  md:flex-row justify-center md:justify-end items-center pt-4 space-y-2 md:space-y-0 md:space-x-2"
                //style={{ marginTop: "10px" }}
              >
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  //style={{ padding: "6px 12px", margin: "4px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  //style={{ padding: "6px 12px", margin: "10px" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
