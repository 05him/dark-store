import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { Footer } from "../components/Footer/Footer";
import { VerticalCard } from "../components/Cards/VerticalCard";
import { useProducts } from "../../context/ProductsContext";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";

export const Favourities = () => {

    const { userData, navigate, location } = useAuth();
    const { userFavouritesList, isLoggedIn } = userData;
        
    // const totalPrice = userFavouritesList?.reduce( (total, {price, discount, qty=1}) => total + calculateFinalPrice(price,discount)*qty ,0 );

    const GotoLogin = () => {
        return <> 
        <Navbar />
        <Heading title={'Nothing here please login to see your favourities'} />
        <button onClick={ ()=>navigate('/login', { state: location }) } className="navigate-to-login-btn" > Login  </button>
        <Footer/>
         </>
    }

    const StayOnFavourities = () =>{
        return <>
        <Navbar />
        { userFavouritesList.length===0 ? <Heading title={'OOps. Your Favourites is empty'} /> : <Heading title={'Favourites'} /> }
        <CardsContainer>
        {
                userFavouritesList?.map( prod  => <VerticalCard key={prod._id} showOnSale={true} showBestSeller={true} productObj={prod} usedInFavourites={true} />) 
        }
        </CardsContainer>
        <Footer/>
        </>

    }

  return isLoggedIn ? <StayOnFavourities /> : <GotoLogin />

}