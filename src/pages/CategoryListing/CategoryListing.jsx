import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "../components/Navbar/Navbar";
import { useProducts } from "../../context/ProductsContext";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";
import { Footer } from "../components/Footer/Footer";
import { FilterProvider} from "../../context/FilterContext/FilterContext";
import { FilteredProducts } from "../components/FilteredProducts/FilteredProducts";

// const ProductsData = ({productsArray, categoryName }) => {
//         return <>
//             <Heading title={categoryName} />
//             <CardsContainer>
//                 <FilteredProducts givenProducts={productsArray} />
//             </CardsContainer>
//         </>
// }



export const CategoryListing = () => {
    
    const {categoryName} = useParams();
    const { shuffleArray } = useProducts();
    const { isLoading, setLoader } = useToastAndLoader();

    const [ products, setProducts ] = useState([])
    const [ subCategories, setSubCategories ] = useState([]);

    const fetchProductsOfGivenCategory = async () => {
        setLoader(true)
        try{
        const data = await axios.get('/api/products');
        const tempdata = data.data.products.filter( ({ category_name }) => category_name === categoryName );
        shuffleArray(tempdata);
        setProducts(tempdata);
        }
        catch(eror){
            alert(eror);
        }
    }

    const fetchSubCategories = async () => {
        try{
        const data = await axios.get('/api/categories');
        setSubCategories(data.data.categories.filter( ({category_name}) => category_name === categoryName )[0]?.sub_categories);
        }
        catch(eror){
            alert(eror);
        }
        finally{
            setLoader(false);
        }
    }

    useEffect( ()=>{
        fetchProductsOfGivenCategory();
        fetchSubCategories();
    },[] )

    return <>
    <Navbar />
    <FilterProvider showSubCategory={true} subCategoryArray={subCategories} >
        {/* <ProductsData productsArray={products} categoryName={categoryName} /> */}
        { !isLoading && 
        <section className="flex-basis-for-category" >
        <Heading title={categoryName} />
            <CardsContainer>
                <FilteredProducts givenProducts={products} />
            </CardsContainer>
        </section> }
    </FilterProvider>
    <Footer/>
    </>
}



