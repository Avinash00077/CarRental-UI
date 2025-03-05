import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";

const RideCars = ()=>{
    const pickUpDate = new Date();
    console.log(pickUpDate,"jddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
    const dropOffDate =pickUpDate.getDate()+2
    console.log(dropOffDate," Heeloeeeeeeeeeeeee")
    const selectedLocation =localStorage.getItem("location")||"Hyderabad"
    console.log(selectedLocation,"jjjjj")
    const pickUpTime ="10:00"
    const dropOffTime="11:00"
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(
            `/viewCars?pickUpDate=${pickUpDate}&toDate=${pickUpDate}&location=${selectedLocation}&pickupTime=${pickUpTime}&dropoffTime=${dropOffTime}`
          );
    },[])
    return(
        <div>
            <h1>Hello Sudheer</h1>
        </div>
    )
}

export default RideCars;