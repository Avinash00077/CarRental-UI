import React, { useState, useRef } from "react";
import { ImagePlus } from "lucide-react";

const FileUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSaveImage = () => {
    if (selectedFile) {
        setPreview(false)
      onUpload(selectedFile); 
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div>
      {preview && (
        <div
          className="fixed inset-0 flex items-center justify-center w-[50%] z-50"
          style={{ marginLeft: "30%",padding:"20px" }}
        >
          <div className="bg-white dark:bg-neutral-950 relative flex flex-col items-center justify-center rounded-lg shadow-2xl w-[90%] mx-4 md:mx-0 p-8 space-y-8">
            <h1 className="text-[#6f82c6] font-semibold text-lg" style={{margin:"10px 0px"}}>
              View Preview
            </h1>
            <img
              src={preview}
              alt="Preview"
              className="w-11/12 h-72 object-cover border border-gray-500 rounded-lg"
            />
            <div className="flex justify-end items-end w-full" style={{margin:"10px 0px"}}>
              <button
                className="w-20 rounded-lg h-10 border border-gray-500"
                onClick={handleCancel}
                
              >
                Cancel
              </button>
              <button
                className="w-20 rounded-lg h-10 text-white bg-[#6f82c6]"
                onClick={handleSaveImage}
                style={{margin :"0px 10px"}}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="bottom-4 right-4 flex p-3 rounded-full shadow-md cursor-pointer"
        onClick={handleClick}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <ImagePlus size={30} color="#6f82c6" />
      </div>
    </div>
  );
};

export default FileUpload;
