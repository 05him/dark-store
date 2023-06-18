import { useState, useEffect } from 'react';

import { Logo } from '../Logo/Logo';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useToastAndLoader } from '../../../context/ToastAndLoaderContext/ToastAndLoaderContext';
import { tr } from '@faker-js/faker';

export const Navbar = () => {

    const { setToast } = useToastAndLoader();
    const { userData: { isLoggedIn, userCart, userFavouritesList }, handleLogout, navigate, location } = useAuth();
    const [ searchBarDisplay, setSearchBarDisplay ] = useState('none');
    const [ showNavbar, setShowNavbar ] = useState(false);
    const navigateToLogin = () =>{
        isLoggedIn ? handleLogout() : navigate('/login', { state: location });
    }

    const showSearchBar = () => setSearchBarDisplay('flex');

    const hideSearchBar = () => setSearchBarDisplay('none');
    
    const navigateToSignup = () => navigate('/signup');

    const handleSearch = e => {
            if(e.key==='Enter'){
                if( e.nativeEvent.target.value.trim().length===0 ){
                    setToast('Please type something to search', 'warning');
                }
                else{
                navigate(`/shopAll/${e.target.value.trim()}`);
                }
            }
    }

    const [ lastScrollValue, setLastScrollValue ] = useState(0);

    const handleScroll = () => {
        // if(window.scrollY<lastScrollValue){
        //     console.log(window.scrollY, lastScrollValue, 'if')
        //   setShowNavbar(true)
        // }else{
        //     console.log(window.scrollY, lastScrollValue, 'else')
        //     setShowNavbar(false)
        // }
        // setLastScrollValue(v => { console.log('inside setter', lastScrollValue, window.scrollY); return window.scrollY })
    }

    useEffect( () => {
        window.addEventListener('scroll', handleScroll);
    }, [] )

    return <nav>
        <div className= {`nav-container ${ showNavbar && 'nav-fixed'}`} >
        <div className= 'search-bar-container flex-center' style={{ display: searchBarDisplay }} > 
        <input type='text' placeholder='search here' onKeyDown={ handleSearch }  />
        <button className='search-bar-cross-btn' onClick={ hideSearchBar } > X </button>
         </div>
        <div className='nav-first-section' >
            <button className='btn-login' onClick={navigateToLogin} > { isLoggedIn ? 'LogOut' : 'LogIn' } </button>
            <button className='btn-signup' onClick={navigateToSignup} style={{ display: isLoggedIn ? 'none' : '' }} > { !isLoggedIn && 'SignIn' } </button>
        </div>

        <Logo/>

        <div className='nav-last-section' >
            <button onClick={ showSearchBar } > Serch </button>
            <button onClick={ ()=> navigate('/cart', { state: location }) } > Cart { (isLoggedIn && userCart.length!==0) && `(${userCart.length})` } </button>
            <button onClick={ ()=> navigate('/favourites') } > Favourites { (isLoggedIn && userFavouritesList.length!==0) && `(${userFavouritesList.length})` } </button>
        </div>
        </div>
    </nav>
}