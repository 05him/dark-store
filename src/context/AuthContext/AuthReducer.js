import { useReducer } from "react";
import { useToastAndLoader } from "../ToastAndLoaderContext/ToastAndLoaderContext";

const handleUserData = ( data, action ) => {
    switch(action.type){
        case 'loginSuccess' : return({ ...data, isLoggedIn: true, firstName: action.userObject.firstName, lastName: action.userObject.lastName, email: action.userObject.email, userCart: action.userObject.cart ?? action.userObject.userCart ?? [], userAddressList: action.userObject.addressList ?? action.userObject.userAddressList ?? [], userFavouritesList: action.userObject.favouritesList ?? action.userObject.userFavouritesList ?? [], authToken: action.token });

        case 'updateCart' : return({ ...data, userCart: action.newCart });

        case 'updateFavourities' : return({ ...data, userFavouritesList: action.newList });

        case 'updateAddress' : return({ ...data, userAddressList: action.newList });

        case 'logout' : return({ ...data, isLoggedIn: false });

        default: throw Error(`some error in ${action.type}`);
    }
}

export const useUserDataReducer = () => {

    const { setToast } = useToastAndLoader();
    
    const [ userData, setUserData ] = useReducer( handleUserData, { isLoggedIn: false, firstName: '', lastName: '', email: '', userCart: [], userAddressList: [], userFavouritesList: [], authToken: ''  } )

    const updateLocalStorage = () => localStorage.setItem(`${userData.email}`, JSON.stringify(userData));

    updateLocalStorage();

    const handleUserLogin = (userObject, token) => setUserData({ type: 'loginSuccess', userObject: userObject, token: token }) ;

    const updateCartHandler = cart => setUserData({ type: 'updateCart', newCart: cart });

    const updateFavouritiesHandler = list => setUserData({ type: 'updateFavourities', newList: list });

    const handleLogout = () => {
        setUserData({ type: 'logout' });
        setToast('Logged Out', 'success');
    }

    const checkInCart = prodID => userData.userCart.find( ({ _id }) => _id === prodID );

    const checkInFavourite = prodId => userData.userFavouritesList.find( ({ _id}) => _id === prodId);

    const updateAddressHandler = list => setUserData({ type: 'updateAddress', newList: list });

    return ({ userData, handleUserLogin, checkInCart, updateCartHandler, handleLogout, checkInFavourite, updateFavouritiesHandler, updateAddressHandler });
}