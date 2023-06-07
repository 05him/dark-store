import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import star from '../../../assets/complete-star.svg';
import whiteHeart from '../../../assets/white-heart.svg';
import blackHeart from '../../../assets/black-heart.svg';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useToastAndLoader } from '../../../context/ToastAndLoaderContext/ToastAndLoaderContext';
import { useProducts } from '../../../context/ProductsContext';


export const HorizontalCard = ({ productObj, showBestSeller, showOnSale, redirectOnButtonClick }) => {

    const { _id, title, price, description, thumbnail, discount, rating, best_seller, on_sale, stock_quantity, qty=1 } = productObj;

    const navigate = useNavigate();
    const { calculateFinalPrice } = useProducts();
    const { userData, updateCartHandler, favouritiesHandler, checkInFavourite} = useAuth();
    const { setToast } = useToastAndLoader();
    const { isLoggedIn, authToken } = userData;

    const navigateToProduct = () => navigate(`/product/${title}/${_id}`);

    console.log(userData);

    const removeFromCart = async() => {
        const removeCall = await axios.delete(`/api/user/cart/${_id}`, { headers: { 'authorization' : authToken } });
        updateCartHandler(removeCall.data.cart);
        setToast(`${title} removed from cart`, 'success');
    }

    const handleAddToFavourities = () => {
            favouritiesHandler(productObj);
    }

    const handleIncrement = async() => {
        if( qty === stock_quantity ){
            setToast(`only ${stock_quantity} piece available`, 'warning');
        }else{
            const incrementCall = await axios.post(`/api/user/cart/${_id}`, { action: { 'type' : 'increment' }  } ,{ headers: { 'authorization': authToken } });
            updateCartHandler(incrementCall.data.cart);
            setToast('Quantity updated successfully','success');
        }
    }

    const handleDecrement = async () => {
        if(qty===1){
            setToast('min order value is 1','warning');
        }else{
            const decrementCall = await axios.post(`/api/user/cart/${_id}`, { action: { 'type' : 'decrement' }  } ,{ headers: { 'authorization': authToken } });
            updateCartHandler(decrementCall.data.cart);
            setToast('quantity updated successfully', 'success');
        }
    }

    return  <div className="card-box-horizontal">

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
                    <span className="card-price-final"> ₹{calculateFinalPrice(price, discount)} </span>
                    <span className="card-price-initial"> ₹{price} </span>
                    <span className="card-discount block"> {discount}% OFF </span>
                    <span className="card-desc block"> {description} </span>
                    { stock_quantity<5 && stock_quantity!==0 && <span className="card-quantity-warning" > Hurry UP! Only {stock_quantity} quantity left </span> }
                    <div className='quantity-container' > <button onClick={ handleIncrement } className='quantity-btn' > + </button> {qty} <button onClick={handleDecrement} className='quantity-btn' > - </button> </div>
                    <div className="card-btn-box flex-center">
                        <button type="button" onClick={ removeFromCart } > Remove from cart </button>
                    </div>
                </div>

            </div>
}