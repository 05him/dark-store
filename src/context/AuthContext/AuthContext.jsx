import { useContext, createContext, useEffect } from "react";

import { useUserDataReducer } from "./AuthReducer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const { userData, handleUserLogin, updateCartHandler, checkInCart, handleLogout, favouritiesHandler, checkInFavourite, handleIncreaseQyantity} = useUserDataReducer();


    // useEffect( ()=>{
    //     findUserData();
    // },[] )

    return <AuthContext.Provider value={{ userData, handleUserLogin, updateCartHandler, checkInCart, handleLogout, favouritiesHandler, checkInFavourite, handleIncreaseQyantity}} >
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);