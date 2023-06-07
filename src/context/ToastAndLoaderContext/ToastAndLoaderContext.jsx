import { useState, useContext, createContext } from "react"
import { v4 as uuid } from "uuid";

const SingleToast = ({ message, alertType }) => {

    const alertColor = `var(--toast-${alertType}-color)`;

    const [ displayNone, setDisplayNone ] = useState('flex');

    setTimeout( () => setDisplayNone('none'), 3500 )

    return <div className="toast-container" style={{ borderColor: alertColor, display: displayNone }} >
        <div className="toast-cross-btn"> X </div>
        <div className="toast-text" style={{ color: alertColor }} > {message} </div>
        <span className="toast-timeline" style={{ backgroundColor: alertColor }} > </span>
    </div>
}

const ToastAndLoaderContext = createContext();

export const ToastProvider = ({children}) => {
    
    const [ toastArray, setToastArray ] = useState([]);
    const [ isLoading, setLoading ] = useState(false);
    const [ loaderMessage, setLoaderMessage ] = useState('');

    const setLoader = (value,message) => {
        setLoading(value);
        if(message){
            setLoaderMessage(message);
            setTimeout( () => setLoaderMessage(''),5000 )
        }
    }


    const setDisplay = () => setTimeout( () =>  'none' , 3500 )

    const setToast = ( givenMessage, alertType ) => setToastArray( arr => [...arr, <SingleToast key={uuid()} style={{ display: setDisplay() }} message={givenMessage} alertType={alertType} />] );

    return <ToastAndLoaderContext.Provider value={{setToast, setLoader, isLoading}} >
        {children}
        { isLoading && <div className="loader-container flex-center" > <div className="loader-msg" > { loaderMessage.length===0 ? 'Loading Please Wait.....' : loaderMessage } </div> </div> }
        <div className='toast-list-container' >
            { toastArray }
        </div>

    </ToastAndLoaderContext.Provider>
}


export const useToastAndLoader = () => useContext(ToastAndLoaderContext);