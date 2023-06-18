import whiteHeart from '../../../assets/white-heart.svg';
import blackHeart from '../../../assets/black-heart.svg';
import star from '../../../assets/complete-star.svg';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useProducts } from '../../../context/ProductsContext';

export const VerticalCard = ({ productObj, showBestSeller, redirectOnButtonClick, showOnSale, showIsNew, usedInFavourites }) => {

    const { _id, title, price, description, thumbnail, discount, rating, best_seller, on_sale, stock_quantity } = productObj;

    const { calculateFinalPrice } = useProducts();

    const { userData, handleAddToCart, checkInCart, checkInFavourite, handleAddToFavourities, navigate } = useAuth();
    const { isLoggedIn } = userData;

    const navigateToProduct = () => navigate(`/product/${title}/${_id}`);

    return  <div className="card-box-vertical">

                { stock_quantity===0 &&  <div className="card-overlay"> <div className='out-of-stock-text' >  Out Of Stock </div> </div> }

                <div className="card-img flex-center">
                    <img className='thumbnail' onClick={navigateToProduct} src={thumbnail} alt={title} />
                    <div className='rating' > {rating} <img className='star' src={star} alt='star' />  </div>
                    { showOnSale && on_sale && <div className='on-sale' > On Sale </div> }
                    { showBestSeller && best_seller && <div className='best-seller' > Best Seller </div> }
                </div>

                <div className='favourities-container' onClick={ () => handleAddToFavourities(productObj, redirectOnButtonClick) } style={{ background: (checkInFavourite(_id) && isLoggedIn ) ? 'red' : 'white' }} > <img className="card-badge-top-right" src={ (checkInFavourite(_id) && isLoggedIn ) ? whiteHeart : blackHeart } alt='favourities' />  </div>

                <div className="card-text" >
                    <h3 className="card-title" onClick={navigateToProduct} > {title} </h3>
                    <span className="card-price-final"> ₹{calculateFinalPrice(price,discount)} </span>
                    <span className="card-price-initial"> ₹{price} </span>
                    <span className="card-discount block"> {discount}% OFF </span>
                    <span className="card-desc block"> {description} </span>
                    { stock_quantity<5 && stock_quantity!==0 && <span className="card-quantity-warning" > Hurry UP! Only {stock_quantity} quantity left </span> }
                    <div className="card-btn-box flex-center">
                        <button type="button" onClick={ () => handleAddToCart(productObj, redirectOnButtonClick, usedInFavourites) } > { (checkInCart(_id) && isLoggedIn && !usedInFavourites ) ?  'Go To Cart' : 'Add To Cart' } </button>
                    </div>
                </div>

            </div>
}