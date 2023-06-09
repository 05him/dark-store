import { useContext, createContext, useState } from 'react';

import { useFilterReducer } from './filterReducer';
import { useToastAndLoader } from '../ToastAndLoaderContext/ToastAndLoaderContext';

export const FilterContext = createContext();

export const FilterProvider = ({ children, showSubCategory, subCategoryArray, isBestSeller, isNew, isSale, isShowAll, categoryData }) => {

    const { isLoading } = useToastAndLoader();

    const [ priceValue, setPriceValue ] = useState(999);
    
    const { filterData, handleFilterChange, handleSort, handleAddSubCategory, handleRemoveSubCategory, handleRemoveFilters, handleOutOfStock, selectedCategories, subCategoriesOfSelection, handleAddCategory, handleRemoveCategory } = useFilterReducer();

    const handleSUbCategories = e => e.target.checked ? handleAddSubCategory(e.target.value) : handleRemoveSubCategory(e.target.value);

    const handleCategories = e => e.target.checked ? handleAddCategory(e.target.value) : handleRemoveCategory(e.target.value);

    const removeFilters = () => {
        const filterdiv = document.querySelectorAll('.filter-container input');

        filterdiv.forEach( e => e.checked=false );

        handleRemoveFilters();
        setPriceValue(999);
    }

    const handlePrice = e => {
        handleFilterChange( 'filterByPrice', Number(e.target.value) );
        setPriceValue(e.target.value);
    }

    // useEffect( ()=>{
    //     // removeFilters();
    // },[] )

    if( !isLoading ){

        return <FilterContext.Provider value={{ filterData, handleFilterChange }}>
            <main className='filter-provider-main'>
            <aside className='filter-container' >
                <div className='filters-section' > <span className='filters-heading' > Filters </span> <button onClick={ removeFilters } className='clear-all-btn' > Clear All </button> <br/> </div>
                
                <div className='filters-section' >
                <label className='filter-section-heading' > Price
                    <input type="range" min={1} max={999} value={priceValue} onChange={ handlePrice } step={5} />
                    <div> Max Price: { priceValue===999 ? '999+' : priceValue } </div>
                </label>
                </div>
                <div className='filter-section' >
                { isShowAll && <div className='filter-section-heading'> Select Category </div> }
                {
                    isShowAll && categoryData?.map( ({_id, category_name}) => <label key={_id} > <input onChange={ handleCategories } type='checkbox' value={category_name} /> {category_name} </label> )
                }
                { showSubCategory && <div className='filter-section-heading' > Select sub category </div> }
                {
                    showSubCategory && subCategoryArray?.map( category => <label key={category} ><input onChange={handleSUbCategories} type="checkbox" value={category} /> {category} </label> )
                }
                </div>
                <div className='filter-section'>
                <label> <input type='checkbox' onChange={  handleOutOfStock } /> Show out of stock </label>
                </div>
                <div className='filter-section' >
                <div className='filter-section-heading' > Ratings </div>
                <label> <input onChange={ e => handleFilterChange( 'filterByRating', Number(e.target.value) ) } type='radio' name='rating' value={5} /> 5 stars </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByRating', Number(e.target.value) ) } type='radio' name='rating' value={4} />  4+ stars  </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByRating', Number(e.target.value) ) } type='radio' name='rating' value={3} /> 3+ stars  </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByRating', Number(e.target.value) ) } type='radio' name='rating' value={2} /> 2+ stars  </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByRating', Number(e.target.value) ) } type='radio' name='rating' value={1} /> 1+ stars  </label> <br/>
                </div>
                <div className='filter-section' >
                { !isBestSeller && <label> <input onChange={ e => handleFilterChange( 'filterBestSeller', e.target.checked ) } type='checkbox' /> best seller </label> }
                { !isNew && <label> <input onChange={ e => handleFilterChange( 'filterNew', e.target.checked ) } type='checkbox' /> new stock </label> }
                { !isSale && <label> <input onChange={ e => handleFilterChange( 'filterOnSale', e.target.checked ) } type='checkbox' /> on sale </label>  } 
                </div>
                <div className='filter-section' >
                <div className='filter-section-heading' > Discount </div>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={80} /> 80 & Above </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={60} /> 60 & Above </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={40} /> 40 & Above </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={20} /> 20 & Above </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={10} /> 10 & Above </label>
                <label> <input onChange={ e => handleFilterChange( 'filterByDiscount', Number(e.target.value) ) } type='radio' name='discount' value={0} /> No discount </label>
                </div>
                <div className='filter-section' > 
                <div className='filter-section-heading' > sort by price </div>
                <label> <input onChange={ () => handleSort('setLowToHigh') } type='radio' name='sorting' /> Low to high </label>
                <label> <input onChange={ () => handleSort('setHighToLow') } type='radio' name='sorting' /> high to low </label>
                </div>
            </aside>
        {children}
        </main>
        </FilterContext.Provider>
    }
}

export const useFilter = () => useContext(FilterContext);