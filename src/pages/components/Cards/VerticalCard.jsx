import { useNavigate, useLocation } from 'react-router-dom'

import whiteHeart from '../../../assets/white-heart.svg';
import blackHeart from '../../../assets/black-heart.svg';
import star from '../../../assets/complete-star.svg';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useToastAndLoader } from '../../../context/ToastAndLoaderContext/ToastAndLoaderContext';
import { useProducts } from '../../../context/ProductsContext';
import axios from 'axios';

export const VerticalCard = ({ productObj, showBestSeller, redirectOnButtonClick, showOnSale, showIsNew, usedInFavourites }) => {

    const { _id, title, price, description, thumbnail, discount, rating, best_seller, on_sale, stock_quantity } = productObj;

    const { calculateFinalPrice } = useProducts();
    const navigate = useNavigate();
    const location = useLocation();
    const { userData, updateCartHandler, checkInCart, checkInFavourite, favouritiesHandler, handleIncreaseQyantity } = useAuth();
    const { setToast, setLoader } = useToastAndLoader();
    const { isLoggedIn, authToken } = userData;

    const navigateToProduct = () => navigate(`/product/${title}/${_id}`);

    const addToCart = async ( product ) => {
        const addItemCall = await axios.post('/api/user/cart', {product}, { headers: { 'authorization': `${authToken}` } });
        updateCartHandler(addItemCall.data.cart);
        setToast(`${title} added to cart successfully `, 'success');
    }


    const handleAddToCart = () => {
        if( isLoggedIn ){
            if( checkInCart(_id) ){
                if( usedInFavourites ){
                    const { qty, stock_quantity }  = userData.userCart.find( prod => prod._id === _id);
                    if(qty === stock_quantity){
                        setToast(`Only ${stock_quantity} pieces available`, 'warning');
                    }
                    else {
                     handleIncreaseQyantity(_id);
                     setToast(`${title} added to cart successfully `, 'success');
                    }
                }
                else {
                    navigate('/cart');
                }
            }
            else{
                addToCart(productObj);
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

    const handleAddToFavourities = () => {
        if( isLoggedIn ){
            favouritiesHandler(productObj);
        }
        else if ( !isLoggedIn ){
            if( redirectOnButtonClick ){
                navigate('/login', { state: location })
            }
            else{
                setToast('Please Login To Add Items In Your Favourities', 'warning');
            }
        }
    }

    return  <div className="card-box-vertical">

                { stock_quantity===0 &&  <div className="card-overlay"> <div className='out-of-stock-text' >  Out Of Stock </div> </div> }

                <div className="card-img flex-center">
                    <img className='thumbnail' onClick={navigateToProduct} src={thumbnail} alt={title} />
                    <div className='rating' > {rating} <img className='star' src={star} alt='star' />  </div>
                    { showOnSale && on_sale && <div className='on-sale' > On Sale </div> }
                    { showBestSeller && best_seller && <div className='best-seller' > Best Seller </div> }
                </div>

                <div className='favourities-container' onClick={handleAddToFavourities} style={{ background: checkInFavourite(_id) ? 'red' : 'white' }} > <img className="card-badge-top-right" src={ checkInFavourite(_id) ? whiteHeart : blackHeart } alt='favourities' />  </div>

                <div className="card-text" >
                    <h3 className="card-title" onClick={navigateToProduct} > {title} </h3>
                    <span className="card-price-final"> ₹{calculateFinalPrice(price,discount)} </span>
                    <span className="card-price-initial"> ₹{price} </span>
                    <span className="card-discount block"> {discount}% OFF </span>
                    <span className="card-desc block"> {description} </span>
                    { stock_quantity<5 && stock_quantity!==0 && <span className="card-quantity-warning" > Hurry UP! Only {stock_quantity} quantity left </span> }
                    <div className="card-btn-box flex-center">
                        <button type="button" onClick={ handleAddToCart } > { (checkInCart(_id) && isLoggedIn && !usedInFavourites ) ?  'Go To Cart' : 'Add To Cart' } </button>
                    </div>
                </div>

            </div>
}