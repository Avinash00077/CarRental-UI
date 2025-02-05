import React from "react";
import carCrash from '../../assets/car-crash.gif'
import successCar from '../../assets/convertible-car.gif'

const Modal = ({ typeOfModal, message, closeModal }) => {
  return (
    <>
      {typeOfModal === "failure" && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white  relative rounded-2xl shadow-2xl w-full max-w-xs h-auto mx-4 md:mx-0 p-8 space-y-8" style={{padding: "20px"}}>
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
          <div className="bg-white dark:bg-neutral-950 relative rounded-lg shadow-2xl w-full max-w-xs h-44 mx-4 md:mx-0 p-8 space-y-8" style={{padding: "20px"}}>
            <div className="flex items-center justify-center">
              <img src={successCar} alt="Success" className="h-28 w-28" />
            </div>
            <div className="inset-0 flex items-center justify-center text-center z-10 overflow-auto p-4">
              <p className="text-lg font-sm text-black break-words">{message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
