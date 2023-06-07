import { useReducer } from "react";
import { useToastAndLoader } from "../ToastAndLoaderContext/ToastAndLoaderContext";

const handleUserData = ( data, action ) => {
    switch(action.type){
        case 'loginSuccess' : return({ ...data, isLoggedIn: true, firstName: action.userObject.firstName, lastName: action.userObject.lastName, email: action.userObject.email, userCart: action.userObject.cart, userAddressList: action.userObject.addressList, userFavouritesList: action.userObject.favouritesList, authToken: action.token });

        case 'updateCart' : return({ ...data, userCart: action.newCart });

        case 'updateQuantity' : return({ ...data, userCart: data.userCart.map( prod => prod._id === action.productId ? ({ ...prod, qty: (prod.qty ?? 1) +1 }) : prod ) });

        case 'logout' : return({ ...data, isLoggedIn: false });

        case 'addFavourite' : return({ ...data, userFavouritesList: [ ...data.userFavouritesList, action.newFavourite ] });

        case 'removeFavourite' : return({ ...data, userFavouritesList: data.userFavouritesList.filter( ({_id}) => _id!==action.deleteId ) });

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

    const handleIncreaseQyantity = givenId => {
        const { qty, stock_quantity }  = userData.userCart.find(({_id}) => _id === givenId);
        qty === stock_quantity ? setToast(`Only ${stock_quantity} pieces available`) : setUserData({ type: 'updateQuantity', productId: givenId });
    };

    const handleLogout = () => {
        setUserData({ type: 'logout' });
        setToast('Logged Out', 'success');
    }

    const checkInCart = prodID => userData.userCart.find( ({ _id }) => _id === prodID );

    const checkInFavourite = prodId => userData.userFavouritesList.find( ({ _id}) => _id === prodId);

    const favouritiesHandler = prodObj => {
        if(checkInFavourite(prodObj._id)) {
             setUserData({ type: 'removeFavourite', deleteId: prodObj._id }) ;
             setToast(`${prodObj.title} removed from your favourites`, 'success');
         }else{
             setUserData({ type: 'addFavourite', newFavourite: prodObj });
             setToast(`${prodObj.title} added to your favourites`, 'success');
        }
    }

    return ({ userData, handleUserLogin, updateCartHandler, checkInCart, handleLogout, favouritiesHandler, checkInFavourite, handleIncreaseQyantity});
}