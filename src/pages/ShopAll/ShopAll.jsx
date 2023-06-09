import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "../components/Navbar/Navbar";
import { useProducts } from "../../context/ProductsContext";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";
import { FilterProvider} from "../../context/FilterContext/FilterContext";
import { FilteredProducts } from "../components/FilteredProducts/FilteredProducts";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { useFilter } from "../../context/FilterContext/FilterContext";
import { Footer } from "../components/Footer/Footer";

// const ProductsData = ({productsArray, categoryName }) => {
//         return <>
//             <Heading title={categoryName} />
//             <CardsContainer>
//                 <FilteredProducts givenProducts={productsArray} />
//             </CardsContainer>
//         </>
// }



export const ShopAll = () => {

    const { shuffleArray } = useProducts();
    const { isLoading, setLoader } = useToastAndLoader();
    const { search } = useParams();

    const searchText = search.replaceAll('%20',' ');

    const [ products, setProducts ] = useState([]);
    const [ categoryList, setCategoryList ] = useState([]);

    const fetchCategoryAndProducts = async() => {
        setLoader(true);
        try{
            const categoryCall = await axios.get('/api/categories');
            setCategoryList(categoryCall.data.categories);
            const productCall = await axios.get('/api/products');
            const tempData = productCall.data.products;
            shuffleArray(tempData);
            setProducts(tempData);
        }
        catch(eror){
            alert(eror);
        }
        finally{
            setLoader(false);
        }
    }
    

    useEffect( ()=>{
        fetchCategoryAndProducts();
    },[] )

    return <>
    <Navbar />
    <FilterProvider isShowAll={true} categoryData={categoryList} >
        {/* <ProductsData productsArray={products} categoryName={categoryName} /> */}
        { !isLoading && 
        <section className="flex-basis-for-category">
        <Heading title={'Shop All'} />
            <CardsContainer>
                <FilteredProducts givenProducts={products} searchedText={searchText} />
            </CardsContainer>
        </section> }
    </FilterProvider>
    <Footer/>
    </>
}

