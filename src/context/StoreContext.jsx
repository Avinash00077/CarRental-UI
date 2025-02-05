import { createContext, useState } from "react";
import { car_list } from "../assets/assets";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

const contextValue = {
        car_list
    }
    return(
       <StoreContext.Provider value={contextValue}>
        {props.children}
       </StoreContext.Provider>     
    )

}

export default StoreContextProvider