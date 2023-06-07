import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Logo } from '../Logo/Logo';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useToastAndLoader } from '../../../context/ToastAndLoaderContext/ToastAndLoaderContext';

export const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { setToast } = useToastAndLoader();
    const { userData: { isLoggedIn }, handleLogout } = useAuth();
    const [ searchBarDisplay, setSearchBarDisplay ] = useState('none');

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

    return <nav>
        <div className='search-bar-container flex-center' style={{ display: searchBarDisplay }} > 
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
            <button onClick={ ()=> navigate('/cart', { state: location }) } > Cart </button>
            <button onClick={ ()=> navigate('/favourites') } > Favourites </button>
        </div>
    </nav>
}