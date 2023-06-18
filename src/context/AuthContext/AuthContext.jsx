import { useContext, createContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { useToastAndLoader } from "../ToastAndLoaderContext/ToastAndLoaderContext";
import { useUserDataReducer } from "./AuthReducer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const { userData, handleUserLogin, updateCartHandler, checkInCart, handleLogout, checkInFavourite, updateFavouritiesHandler, updateAddressHandler } = useUserDataReducer();

    const navigate = useNavigate();
    const location = useLocation();
    const { setToast } = useToastAndLoader();
    
    const { isLoggedIn, authToken } = userData;
    const apiHeader = { headers : { 'authorization': authToken } };

    const removeFromFavourite = async (product) => {
        const removeCall = await axios.delete(`/api/user/favouritesList/${product._id}`, apiHeader);
        updateFavouritiesHandler(removeCall.data.favouritesList);
        setToast(`${product.title} removed from favourites`, 'success');
    }

    const addInFavourite = async (product) => {
        const addCall = await axios.post('/api/user/favouritesList', {product}, apiHeader );
        updateFavouritiesHandler(addCall.data.favouritesList);
        setToast(`${product.title} added to favourites`, 'success');
    }

    const handleAddToFavourities = (product, redirectOnButtonClick) => {
        if( isLoggedIn ){
            checkInFavourite(product._id) ? removeFromFavourite(product) : addInFavourite(product);
        }
        else if ( !isLoggedIn ){
            if( redirectOnButtonClick ){
                navigate('/login', { state: location })
            }
            else{
                setToast('Please Login To Add Items In Your Favourities', 'warning');
            }
        }
    };

    const addToCart = async ( product ) => {
        const addItemCall = await axios.post('/api/user/cart', {product}, apiHeader );
        updateCartHandler(addItemCall.data.cart);
        setToast(`${product.title} added to cart successfully `, 'success');
    }


    const handleAddToCart = async (product, redirectOnButtonClick, usedInFavourites) => {
        if( isLoggedIn ){
            if( checkInCart(product._id) ){
                if( usedInFavourites ){
                    const { qty, stock_quantity }  = userData.userCart.find( prod => prod._id === product._id);
                    if(qty === stock_quantity){
                        setToast(`Only ${stock_quantity} pieces available`, 'warning');
                    }
                    else {
                        const incrementCall = await axios.post(`/api/user/cart/${product._id}`, { action: { 'type' : 'increment' }  } ,apiHeader )
                        updateCartHandler(incrementCall.data.cart);
                        setToast('Quantity updated successfully','success');
                    }
                }
                else {
                    navigate('/cart');
                }
            }
            else{
                addToCart(product);
            }
        }
        else if ( !isLoggedIn ){
            if( redirectOnButtonClick ){
                navigate('/login', { state: location })
            }
            else{
                setToast('Please Login To Add Items In Your Cart', 'warning');
            }
        }
    }

    const findUserData = () => {
        const currentActiveUser = Object.keys(localStorage).filter( k => k!=="loglevel" ).find( k => JSON.parse(localStorage.getItem(k)).isLoggedIn )
        if(currentActiveUser){
            const currentActiveUserDetails = JSON.parse(localStorage.getItem(currentActiveUser));
            handleUserLogin( currentActiveUserDetails, currentActiveUserDetails.authToken )
        }
    }
    
    useEffect( ()=>{
        findUserData();
    },[] )

    return <AuthContext.Provider value={{ userData, handleUserLogin, handleAddToCart, updateCartHandler, checkInCart, handleLogout, handleAddToFavourities, checkInFavourite, navigate, location, apiHeader, updateAddressHandler }} >
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);