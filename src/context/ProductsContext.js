import axios from 'axios';
import { useEffect, useContext, createContext, useState } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({children}) => {

    const [ categories, setCategories ] = useState([]);

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const calculateFinalPrice  = ( price, discount ) => Math.round(price - (price*discount/100));


    return <ProductsContext.Provider value={{ shuffleArray, calculateFinalPrice }} >
        {children}
    </ProductsContext.Provider>
}

export const useProducts = () => useContext(ProductsContext);


