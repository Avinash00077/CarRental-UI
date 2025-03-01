import React from "react";
import Courosel from "../courosel/Courosel";
import SearchForm from "../SearchForm/SearchForm";
import { useScreenSize } from "../../context/screenSizeContext";
import "./Header.css";
const Header = () => {
  const { isScreenSmall } = useScreenSize();
  return (
    <div
      className={`w-full flex ${isScreenSmall&&'flex-col'} mt-7  mb-10 md:mb-0 justify-center items-center`}
      //style={{ marginTop: "55px", marginLeft: "0px", marginBottom: "10px",padding:"10px" }}
    >
            <div className="w-full md:w-8/12">
        <Courosel />
      </div>
      <div className="w-full md:w-4/12">
        <SearchForm fromWhere="homePage" />
      </div>

    </div>
  );
};

export default Header;

{
  /* <div className="flex flex-col items-center justify-center" style={{ margin: '0px 0px ',}}>
  <p className="text-2xl font-bold text-gray-800 mb-4">Bike Rental System</p>
  <p className="mx-auto text-medium text-center text-gray-500 mb-6" style={{ margin: '20px 0px ',}}>
    Welcome to the Bike Rental System! This platform is designed to provide easy and convenient bike rental services. 
    Whether you're looking for a quick ride around the city or planning a day-long adventure, we have a wide variety of bikes 
    to suit your needs. Please note that our services are available for recreational and personal use only.
  </p>
  <p className="mx-auto text-medium text-center text-gray-500 mb-6" style={{ margin: '0px 20px '}}>
    We offer different types of bikes for rent, including mountain bikes, city bikes, and electric bikes. Explore our services 
    to find the perfect bike for your journey. Our simple booking system ensures a hassle-free experience, and we offer flexible rental 
    durations to fit your schedule.
  </p>
  <button
  style={{ margin: '20px 0px '}}
    className="px-4 mt-4 py-3 bg-gradient-to-r h-10 w-36 from-[#6578ca] to-[#9cb0f1] hover:bg-blue-700 rounded-full text-medium font-normal text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
  >
    Rent a Bike
  </button>
</div> */
}

{
  /* <div id="home">
        <div className="text">

            <h1 className='h-screen'>
                <span className='bg-'>Looking</span> to <br/>rent a car
            </h1>
            <h2><span>Adventure</span><br/> Awaits <br/><span> Rent</span> <br/> Today</h2>
            <p>Enjoy Your Ride With Your Dream Car At Low Cost</p>
        </div>
        </div> */
}
