import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { HorizontalCard } from "../components/Cards/HorizontalCard";
import { useProducts } from "../../context/ProductsContext";
import { Footer } from "../components/Footer/Footer";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";

export const Cart = () => {

    const { userData, navigate, location } = useAuth();
    const { userCart, isLoggedIn } = userData;
    const { calculateFinalPrice } = useProducts();
        
    const totalPrice = userCart?.reduce( (total, {price, discount, qty=1}) => total + calculateFinalPrice(price,discount)*qty ,0 );
    const totalItems = userCart?.length;
    const totalQuantity = userCart?.reduce( (total,{qty=1}) => total+qty,0 );

    const GotoLogin = () => {
        return <> 
        <Navbar />
        <Heading title={'Nothing here.. Please Login to see your cart'} />
        <button className="navigate-to-login-btn" onClick={ ()=>navigate('/login', { state: location }) } > Login  </button>
        <Footer/> 
         </>
    }

    const StayOnCart = () =>{
        return <>
        <Navbar />
        { userCart.length===0 ? <Heading title={'OOps. Your Cart is empty'} /> : <Heading title={'Cart'} /> }
        <main className="cart-main" >
      
        <CardsContainer widthPercentage={60} className='cards-container' >
        {
                userCart?.map( prod  => <HorizontalCard key={prod._id} showOnSale={true} showBestSeller={true} productObj={prod} />) 
        }
        </CardsContainer>

        { userCart.length!==0 &&
        <div className="carts-details-container" >
          <div className="cart-details-heading" > cart details </div>
          <div className="qty-info-container" > <span className="qty-info-heading" > Total Items: {totalItems} </span> <span className="qty-info-heading" > Total Quantity: {totalQuantity} </span> </div>
          {
            userCart?.map( ({_id, title, price, discount, qty=1}) => <div key={_id} className="product-desc-container" > <div className="product-desc-title" > { title } </div> <div className="product-quantity-price-container" >  <span className="product-desc-quantity-container" > <span className="product-desc-quantity-heading" > Quantity </span> : <span className="product-desc-quantity"> {qty} </span> </span> <span className="product-desc-price-container" > <span className="product-desc-price-heading">  Price: </span> <span className="product-desc-price" > ₹{ calculateFinalPrice(price,discount)*qty } </span> </span> </div>  </div> )
          }
          
          <div className="total-price-container" > <span className="total-price-heading" > Total price: </span>  <span className="total-price" > ₹{totalPrice} </span> </div>
          <button onClick={ () => navigate('/checkout') } className="proceed-to-checkout-btn" > Proceed To Checkout </button>
        </div> }

        </main>
        <Footer/>
        </>

    }

  return isLoggedIn ? <StayOnCart /> : <GotoLogin />
}