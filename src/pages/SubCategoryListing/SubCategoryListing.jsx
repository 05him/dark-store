import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "../components/Navbar/Navbar";
import { useProducts } from "../../context/ProductsContext";
import { CardsContainer } from "../components/CardsContainer/CardsContainer";
import { Heading } from "../components/Heading/Heading";
import { FilterProvider} from "../../context/FilterContext/FilterContext";
import { Footer } from "../components/Footer/Footer";
import { FilteredProducts } from "../components/FilteredProducts/FilteredProducts";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";

// const ProductsData = ({productsArray, categoryName }) => {
//         return <>
//             <Heading title={categoryName} />
//             <CardsContainer>
//                 <FilteredProducts givenProducts={productsArray} />
//             </CardsContainer>
//         </>
// }



export const SubCategoryListing = () => {
    
    const {categoryName, rawSubCategory} = useParams();

    const subCategory = rawSubCategory.split('=')[1];

    const { shuffleArray } = useProducts();
    const { isLoading } = useToastAndLoader();

    const [ products, setProducts ] = useState([])

    const fetchProductsOfGivenCategory = async () => {
        const data = await axios.get('/api/products');
        const tempdata = data.data.products.filter( prod => {
            if( subCategory==='null' ){
              switch( categoryName ){
                case 'shop all': return true;
                case 'best sellers': return prod.best_seller;
                case 'is new' : return prod.is_new;
                case 'on sale' : return prod.on_sale;
                // case ''
                default: throw Error('error in computing', categoryName);
              }
            }
            else{   
                if(subCategory==='shirt'){
                    return (prod.category_name === categoryName ) && (prod.sub_category.trim().split(' ').includes(subCategory));
                }
                return (prod.category_name === categoryName ) && (prod.sub_category.includes(subCategory));
            } 
        });
        shuffleArray(tempdata);
        setProducts(tempdata);
    }

    useEffect( ()=>{
        fetchProductsOfGivenCategory();
    },[] )

    return <>
    <Navbar />
    <FilterProvider>
        {/* <ProductsData productsArray={products} categoryName={categoryName} /> */}
        { !isLoading && 
        <section className="flex-basis-for-category" >
        <Heading title={subCategory==='null' ? categoryName : subCategory} />
            <CardsContainer>
                <FilteredProducts givenProducts={products} />
            </CardsContainer>
        </section> }
    </FilterProvider>
    <Footer/>
    </>
}

