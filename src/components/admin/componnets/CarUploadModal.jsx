import React from "react";

const CarUploadModal = () => {
  return (
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
  );
};

export default CarUploadModal;
