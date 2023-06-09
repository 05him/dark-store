import { useFilter } from "../../../context/FilterContext/FilterContext";
import { useProducts } from "../../../context/ProductsContext";
import { useToastAndLoader } from "../../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { VerticalCard } from "../Cards/VerticalCard";
import { Heading } from "../Heading/Heading";

export const FilteredProducts = ({givenProducts, searchedText}) => {

    const { filterData } = useFilter();
    const { calculateFinalPrice } = useProducts();
    const { isLoading } = useToastAndLoader();

    const { filterByPrice, filterByRating, filterBestSeller, filterNew, filterOnSale, sortHighToLow, sortLowToHigh, selecetdSubCategories, showOutOfStock, filterByDiscount, selectedCategories } = filterData;

    const productsToDisplay = givenProducts?.filter( ({ price, discount, title, rating, on_sale, best_seller, is_new, sub_category, stock_quantity, category_name }) => (filterByRating ? rating>=filterByRating : true) && (filterByPrice ? (calculateFinalPrice(price,discount)<=filterByPrice ): true) && (filterBestSeller ? best_seller : true) && (filterOnSale ? on_sale : true) && (filterNew ? is_new : true) && (selecetdSubCategories.length!==0 ? selecetdSubCategories.some( el => el==='shirt' ? sub_category.trim().split(' ').includes(el) : sub_category.includes(el) ) : true ) && (showOutOfStock ? true : stock_quantity!==0) && (filterByDiscount ? discount>= filterByDiscount : true) && ( selectedCategories.length!==0 ? selectedCategories.includes(category_name) : true ) && ( searchedText ? (title.includes(searchedText.toLowerCase()) || category_name.includes(searchedText.toLowerCase()) || sub_category.includes(searchedText.toLowerCase()) ): true ) )?.toSorted( (a,b) => sortHighToLow ? ( calculateFinalPrice(b.price, b.discount) - calculateFinalPrice(a.price, a.discount) ) : sortLowToHigh ? ( calculateFinalPrice(a.price,a.discount) - calculateFinalPrice(b.price, b.discount) ) : true  );

    return <>
        { (!isLoading && productsToDisplay?.length===0) && <Heading title={'Oopss... nothing matched your search'} /> } 
        {
           
           productsToDisplay?.map( product  => <VerticalCard key={product._id} productObj={product} redirectOnButtonClick={true} showBestSeller={true} showOnSale={true} />)
        }
    </>
}