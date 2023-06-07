import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import whiteHeart from '../../assets/white-heart.svg';
import blackHeart from '../../assets/black-heart.svg';
import { Navbar } from "../components/Navbar/Navbar";
import { useProducts } from "../../context/ProductsContext";
import { Footer } from "../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import star from '../../assets/complete-star.svg';


export const SingleProductPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { calculateFinalPrice } = useProducts();
    const { productID } = useParams();
    const { userData:{ isLoggedIn, authToken }, updateCartHandler, checkInCart, favouritiesHandler, checkInFavourite } = useAuth();
    const [ product, setProduct ] = useState({});
    const { setToast } = useToastAndLoader();

    const {  _id, title, price, discount, description, rating, thumbnail, stock_quantity, on_sale, best_seller, is_new, category_name, sub_category } = product;

    const fetchProduct = async() => {
        const productCall = await axios.get(`/api/products/${productID}`);
        setProduct(productCall.data.product)
    }

    const addToCart = async ( product ) => {
        const addItemCall = await axios.post('/api/user/cart', {product}, { headers: { 'authorization': `${authToken}` } });
        updateCartHandler(addItemCall.data.cart);
        setToast(`${title} added to cart successfully `, 'success');
        // const fetchNewCart = await axios.get('/api/user/cart', { headers: { 'authorization' : `${authToken}` } });
    }

    const handleAddToCart = () => {
        if( isLoggedIn ){
            if( checkInCart(_id) ){
                navigate('/cart');
            }
            else{
                addToCart(product);
            }
        }
        else if ( !isLoggedIn ){
                navigate('/login', { state: location })
        }
    }

    const handleAddToFavourities = () => {
        if( isLoggedIn ){
            favouritiesHandler(product);
        }
        else if ( !isLoggedIn ){
                navigate('/login', { state: location })
            }
        
    }

    useEffect(()=>{
        fetchProduct();
    },[])

    return <>
    <Navbar />
    { Object.keys(product).length !== 0 && <section className="single-product-section" >
        <div className="thumbnail-container" > <img src={thumbnail} alt={title} /> </div>
        <div className="card-data" >
            <div className="title" > {title} </div>
            <span className="final-price" > ₹{calculateFinalPrice(price,discount)} </span>
            <span className="initial-price" > ₹{price} </span>
            <div className="discount"> {discount}% OFF </div>
            <div className='favourities-container' onClick={handleAddToFavourities} style={{ background: checkInFavourite(_id) ? 'red' : 'white' }} > <img className="card-badge-top-right" src={ checkInFavourite(_id) ? whiteHeart : blackHeart } alt='favourities' />  </div>
            <div className="rating"> {rating} <img className='star' src={star} alt='star' />  </div>
            <div className="category-name-container" > <span className="category-name-heading" > Category Name: </span> <span className="category-name"> {category_name} </span> </div>
            { ( on_sale || best_seller || is_new ) && <div className="tags-container" > <span className="tag-heading" > Tags:  </span> { best_seller && <span className="tag-name" > Best Seller </span> } { is_new && <span className="tag-name" > New Product </span> } { on_sale && <span className="tag-name" > On Sale </span> } </div>}

            <div className="sub-category-container" > <span className="sub-category-heading" > Sub Category :  </span>  { sub_category.includes('party wear') ? <> <span className="sub-category-name"> party wear </span> {sub_category.replace(' party wear','').split(' ')?.map( (category,index) => <span key={index} className="sub-category-name" > {category} </span> ) } </> :  sub_category.split(' ')?.map( (category,index) => <span key={index} className="sub-category-name" > {category} </span> ) } </div>
            <div className="description-container" > <span className="description-heading" > Description : </span> <span className="description-text" > {description} </span> </div>
            {/* <div className="quantity-container"> <span className="quantity-heading" > Quantity: </span> <span> <input type="number" min={1} max={stock_quantity} /> </span> </div> */}
           <div className="btn-container"> <button type="button" onClick={ handleAddToCart } > { (checkInCart(_id) && isLoggedIn) ? 'Go To Cart' : 'Add To Cart' } </button> </div>
        </div>
    </section>}
    <Footer/>
    </>

}