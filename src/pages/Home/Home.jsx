import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useProducts } from '../../index'
import { Navbar } from "../components/Navbar/Navbar";
import { Crousel } from "../components/Crousel/Crousel";
import { Footer } from "../components/Footer/Footer";
import { VerticalCard } from "../components/Cards/VerticalCard";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";

import accessoriesIcon from '../../assets/accessories.svg';
import bestSellersIcon from '../../assets/best-sellers.svg';
import kidsIcon from '../../assets/kids.svg';
import mensIcon from '../../assets/mens.svg';
import newLaunchIcon from '../../assets/new-launch.svg';
import saleIcon from '../../assets/sale.svg';
import womensIcon from '../../assets/womens.svg';

export const Home = () => {

    const { shuffleArray} = useProducts();
    const { setLoader } = useToastAndLoader();
    const [ bestSellers, setBestSellers ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoader(true);
        try{
        const categoriesCall = await axios.get("/api/categories");
        setCategories( cat => categoriesCall.data.categories );
        }
        catch (eror) {
            alert(eror);
        }
        finally{
            // setLoader(false);
        }
    }

    const fetchBestSellers = async () => {
        try{
        const bestSellersCall = await axios.get("/api/products");
        const tempData =  bestSellersCall.data.products.filter( ({best_seller}) => best_seller );
        shuffleArray(tempData);
        setBestSellers( prod => tempData.slice(0,10) );
        }
        catch(eror){
            alert(eror);
        }
        finally{
            setLoader(false);
        }
    }
    
    
    const ShowCategory = () => {
        return <section className="top-category-section" >  

       <AttachSubCategory givenCategory={ "shop all" } /> 
       <AttachSubCategory givenCategory={"mens"} haveSubCategory={true} /> 
       <AttachSubCategory givenCategory={"womens"} haveSubCategory={true} /> 
       <AttachSubCategory givenCategory={"kids"} haveSubCategory={true} /> 
       <AttachSubCategory givenCategory={"accessories"} haveSubCategory={true} /> 
       <AttachSubCategory givenCategory={"best sellers"} /> 
        </section>
    }

    const AttachSubCategory = ( {givenCategory, haveSubCategory }) => {

    
        if(haveSubCategory){
            const subCategories =  categories?.filter( ({category_name}) => category_name === givenCategory )[0]?.sub_categories
            return <div className="category-container" >
                <Link className="category-name" to={`/category/${givenCategory}`} > { givenCategory } </Link>
                <ul className="sub-categories-list" >
                    {
                        subCategories?.map( (category, index) => <li key={index} > <Link to={`/category/${givenCategory}/sub-category=${category}`} > {category} </Link> </li>  )
                    }
                </ul>
            </div>
        }
        else{
            return <div className="category-container" > <Link className="category-name" to={`/category/${givenCategory}/sub-category=null`} > { givenCategory } </Link> </div>
        }
    }
    
    const ShowCategoryBox = () => {
        return <section className="show-category-box" >
            <div className="show-category-box-hidden" >
            <div className="category-icon-container"> 
                <img src={mensIcon} alt='mens icon' />
                <span> Mens </span>
            </div>
            <div className="category-icon-container" >
                <img src={womensIcon} alt='women icon' />
                <span> Womens </span>
            </div>
            <div className="category-icon-container" >
                <img src={kidsIcon} alt='kids icon' />
                <span> Kids </span>
            </div>
            <div className="category-icon-container" >
                <img src={bestSellersIcon} alt='best seller icon' />
                <span> Best Sellers </span>
            </div>
            <div className="category-icon-container" >
                <img src={saleIcon} alt='sale icon' />
                <span> On Sale </span>
            </div>
            <div className="category-icon-container" >
                <img src={newLaunchIcon} alt='new launch icon' />
                <span> New Launch </span>
            </div>
            <div className="category-icon-container" >
                <img src={accessoriesIcon} alt='accessories icon' />
                <span> Accessories </span>
            </div>
            </div>
        </section>
    }
    
    
    const BestSeller = () => {
        return <section className="best-seller-container" >
            <Heading title="best sellers" />
            <CardsContainer widthPercentage={90} >
            {
                bestSellers?.map( product  => <VerticalCard key={product._id} productObj={product} showBestSeller={false} redirectOnButtonClick={false} showOnSale={true} />)
            }
            </CardsContainer>
            <button className="view-all-btn" onClick={ () =>  navigate('/category/best sellers/sub-category=null') } > View All -{">"} </button>
        </section>
    }


    useEffect( ()=>{
        fetchCategories();
        fetchBestSellers();
    },[] )

    return <>
    <Navbar/>
    <ShowCategory/>
    <Crousel/>
    <ShowCategoryBox/>
    <BestSeller />
    <Footer/>
    </>
}