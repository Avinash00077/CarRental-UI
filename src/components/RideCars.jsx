import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";

const RideCars = ()=>{
    const pickUpDate = new Date();

const dropOffDate = new Date(pickUpDate); // Clone the date
dropOffDate.setDate(pickUpDate.getDate() + 2); // Add 2 days

    const selectedLocation =localStorage.getItem("location")||"Hyderabad"
    const pickUpTime ="10:00"
    const dropOffTime="11:00"
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(
            `/viewCars?pickUpDate=${pickUpDate}&toDate=${dropOffDate}&location=${selectedLocation}&pickupTime=${pickUpTime}&dropoffTime=${dropOffTime}`
          );
    },[])
    return(
        <div>
            <h1>Loading .............</h1>
        </div>
    )
}

export default RideCars;