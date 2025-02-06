import React from "react";
import { Loader2 } from "lucide-react";

const MyBookings = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto" size={50} style={{marginLeft:"100px",marginBottom:"30px"}} />
        <h1 className="mt-4 text-lg font-semibold text-gray-700" style={{marginLeft:"00px"}}>
          This page is a work in progress...
        </h1>
      </div>
    </div>
  );
};

export default MyBookings;
