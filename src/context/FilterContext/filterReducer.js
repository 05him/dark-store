import { useReducer } from "react";

const handleFilterData = ( data, action ) => {
    switch (action.type) {
        case 'setFilter' : return ({ ...data, [action.filterName]: action.payload });

        case 'setHighToLow' : return({ ...data, sortHighToLow: true, sortLowToHigh: false });

        case 'setLowToHigh' : return({ ...data, sortLowToHigh: true, sortHighToLow: false });

        case 'removeSort' : return({ ...data, [data.sortName]: false });

        case 'addSubCategory' : return({ ...data, selecetdSubCategories: [...data.selecetdSubCategories, action.value] });

        case 'removeSubCategory' : return({ ...data, selecetdSubCategories: data.selecetdSubCategories.filter( subCategory => subCategory!==action.value ) });

        case 'removeFilters' : return({ ...data, filterByRating: false, filterByPrice: false, filterBestSeller: false, filterOnSale: false, filterNew: false, sortHighToLow: false, sortLowToHigh: false, selecetdSubCategories: [], showOutOfStock: false, filterByDiscount: false, minPrice: 0, maxPrice: 0, selectedCategories:[], subCategoriesOfSelection: [], searchText: false });

        case 'manageOutOfStock' : return({ ...data, showOutOfStock: !data.showOutOfStock });

        case 'addCategory' : return({ ...data, selectedCategories: [ ...data.selectedCategories, action.newCategory ] });

        case 'removeCategory' : return({ ...data, selectedCategories: data.selectedCategories.filter( category => category!==action.value ) }) ;

        case 'addSearch' :{
            // console.log(action);
             return({ ...data, searchText: 'cover' });
        }

        default: throw Error('eroor in ', action.type)

    }
}

export const useFilterReducer = () => {
    const [ filterData, updateFilterData ] = useReducer(handleFilterData, { filterByRating: false, filterByPrice: false, filterBestSeller: false, filterOnSale: false, filterNew: false, sortHighToLow: false, sortLowToHigh: false, selecetdSubCategories: [], showOutOfStock: false, filterByDiscount: false, minPrice: 0, maxPrice: 0, selectedCategories:[], subCategoriesOfSelection: [], searchText: '' });

    const handleFilterChange = (filterType, value) =>  { 
        updateFilterData({ type: 'setFilter', filterName: filterType, payload: value });
    }

    console.log(filterData);

    const handleSort = sortName => updateFilterData({ type: sortName });
    const handleRemoveSort = sortName => updateFilterData({ type: 'removeSort', sortName: sortName });
    const handleAddSubCategory = categoryName => updateFilterData({ type: 'addSubCategory', value: categoryName });
    const handleRemoveSubCategory = categoryName => updateFilterData({ type: 'removeSubCategory', value: categoryName });
    const handleRemoveFilters = () => updateFilterData({ type: 'removeFilters' });
    const handleOutOfStock = () => updateFilterData({ type: 'manageOutOfStock' });
    const handleAddCategory = category => updateFilterData({ type: 'addCategory', newCategory: category });
    const handleRemoveCategory = category => updateFilterData({ type: 'removeCategory', value: category });
    const handleAddSearch = text =>{
         updateFilterData({ type: 'addSearch', value: text });
    }
    return ( {filterData, handleFilterChange, handleSort, handleAddSubCategory, handleRemoveSubCategory, handleRemoveFilters, handleRemoveSort, handleOutOfStock, handleAddCategory, handleRemoveCategory, handleAddSearch });
}

