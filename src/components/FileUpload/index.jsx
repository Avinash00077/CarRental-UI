import React, { useState, useRef } from "react";
import { ImagePlus, Pencil } from "lucide-react";
import { useScreenSize } from "../../context/screenSizeContext";

const FileUpload = ({ onUpload, type }) => {
  const [preview, setPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [LisenceValue, setLisenceValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const { isScreenSmall } = useScreenSize();
  const [error, setError] = useState({ aadhar: "", licence: "", expiry: "" });
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
  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleAadharChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setAadharNumber(value);
      validateAadhar(value);
    }
  };

  const validateAadhar = (value) => {
    if (!/^\d{12}$/.test(value)) {
      setError((prev) => ({
        ...prev,
        aadhar: "Aadhaar number must be exactly 12 digits.",
      }));
    } else {
      setError((prev) => ({ ...prev, aadhar: "" }));
    }
  };

  const handleExpiryChange = (e) => {
    setExpiryDate(e.target.value);
  };
  const handleLicenceChange = (e) => {
    const value = e.target.value;
    setLisenceValue(value);
    validateLicence();
  };

  // Validate Licence Format
  const validateLicence = () => {
    const licenceRegex = /^[A-Z][a-z]{2}\d{7,13}$/; // Example: "DL1234567890123"
    if (!licenceRegex.test(LisenceValue)) {
      setError((prev) => ({
        ...prev,
        licence: "Invalid Licence Format (e.g., AP1234567890123).",
      }));
    } else {
      setError((prev) => ({ ...prev, licence: "" }));
    }
  };
  const validateExpiry = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (!expiryDate || expiryDate <= today) {
      setError((prev) => ({
        ...prev,
        expiry: "Expiry date must be in the future.",
      }));
    } else {
      setError((prev) => ({ ...prev, expiry: "" }));
    }
  };

  const handleSaveImage = () => {
    let data = {
      selectedFile: selectedFile,
      LisenceValue: LisenceValue,
      expiryDate: expiryDate,
      aadharNumber: aadharNumber,
      type: type,
    };
    if (selectedFile) {
      if (type == "Aaadhar" && aadharNumber.length === 12) {
        setPreview(false);
        onUpload(data);
        setError((prev) => ({
          ...prev,
          aadhar: "",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          aadhar: "Please Enter Aaadhar Number",
        }));
      }
      if (type == "Licence" && LisenceValue.length > 10 && expiryDate !== "") {
        setPreview(false);
        onUpload(data);
      } else {
        if (!LisenceValue.length < 10) {
          setError((prev) => ({
            ...prev,
            licence: "Please Enter licence",
          }));
        }
        if (expiryDate == "") {
          setError((prev) => ({
            ...prev,
            expiry: "Please Enter Expiry date",
          }));
        }
      }
      if (type === "profile") {
        setPreview(false);
        onUpload(data);
      }
    }
  };

  return (
    <div>
      {preview && (
        <div
          className={`fixed inset-0 flex items-center justify-center ${
            isScreenSmall ? "w-[100%]" : "w-[50%]"
          } z-50`}
          style={isScreenSmall ? {} : { marginLeft: "30%", padding: "20px" }}
        >
          <div className="bg-gradient-to-b from-[#caefd7] via-[#f5bfd7] to-[#abc9e9]  relative flex flex-col items-center justify-center rounded-lg shadow-2xl w-[90%] mx-4 md:mx-0 p-8 space-y-8">
            <h1
              className="text-[#6f82c6] font-semibold text-lg"
              style={{ margin: "10px 0px" }}
            >
              View Preview
            </h1>
            {type === "Licence" && (
              <div
                className=" w-full"
                style={{ margin: "5px 10px", padding: " 10px 20px" }}
              >
                <label className="block font-medium">Drivers Licence:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={LisenceValue}
                  onChange={handleLicenceChange}
                  onBlur={validateLicence}
                  className="w-full p-2 border border-gray-400 rounded"
                  style={{ padding: "5px", margin: "5px 0px" }}
                  placeholder="Enter Your valid Drivers License"
                />
                {error.licence && (
                  <p className="text-red-500">{error.licence}</p>
                )}
                <label className="block font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  onBlur={validateExpiry}
                  className="w-full p-2 border border-gray-400 rounded"
                  style={{ padding: "5px", margin: "5px 0px" }}
                />
                {error.expiry && <p className="text-red-500">{error.expiry}</p>}
              </div>
            )}
            {type === "Aaadhar" && (
              <div
                className="w-full"
                style={{ margin: "5px 10px", padding: "10px 20px" }}
              >
                <label className="block font-medium">Aadhaar Number:</label>
                <input
                  type="text"
                  value={aadharNumber}
                  onChange={handleAadharChange}
                  onBlur={validateAadhar}
                  className="w-full p-2 border border-gray-400 rounded"
                  style={{ padding: "5px", margin: "5px 0px" }}
                  placeholder="Enter Aadhaar Number"
                />
                {error.aadhar && <p className="text-red-500">{error.aadhar}</p>}
              </div>
            )}
            <img
              src={preview}
              alt="Preview"
              className="w-11/12 h-72 object-cover border border-gray-500 rounded-lg"
            />
            <div
              className="flex justify-end items-end w-full"
              style={{ margin: "10px 0px" }}
            >
              <button
                className="w-20 rounded-lg cursor-pointer  hover:-translate-y-1 hover:bg-red-500 hover:border-none hover:text-white h-10 border border-gray-500"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="w-20  cursor-pointer hover:-translate-y-1  rounded-lg h-10 text-white bg-[#6f82c6]"
                onClick={handleSaveImage}
                style={{ margin: "0px 10px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="bottom-4 right-4 flex p-3 rounded-full  cursor-pointer hover:-translate-y-2"
        onClick={handleClick}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        {type == "Licence" || type == "Aaadhar" ? (
          <Pencil size={25} color="#6f82c6" />
        ) : (
          <ImagePlus size={30} color="#6f82c6" />
        )}
      </div>
    </div>
  );
};

export default FileUpload;
