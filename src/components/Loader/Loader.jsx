import React from "react";

const Loader = ({ message ='...Loading' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-90">
      <div className="bg-white dark:bg-neutral-950 relative rounded-lg shadow-2xl w-full max-w-[340px] h-[200px] mx-4 md:mx-0 p-8 space-y-8" style={{ padding: "40px 40px", }}>
        <div className="inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#121212] rounded-full animate-spin"></div>
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center space-y-4" style={{ marginTop: "20px", }}>
          <p className="text- font-bold text-gray-800 dark:text-gray-100 text-center mx-4 md:mx-0 overflow-hidden">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
