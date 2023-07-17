import { useAuth } from '../../../context/AuthContext/AuthContext';

import { Logo } from "../Logo/Logo";

export const Footer = () => {

    const navigateToLogin = () =>{
        isLoggedIn ? handleLogout() : navigate('/login', { state: location });
    }

    const navigateToSignup = () => navigate('/signup');

    const { userData: { isLoggedIn }, handleLogout, navigate, location } = useAuth();

    return <footer> 
        <Logo/>
        <div className="quick-links" >
            <div className="quick-links-heading" > Quick Links  </div>
            <div className="quick-links-container" >
            <button onClick={ ()=> navigate('/cart', { state: location }) } > Cart </button>
            <button onClick={ ()=> navigate('/favourites') } > Favourites </button>
            <button onClick={navigateToLogin} > { isLoggedIn ? 'LogOut' : 'LogIn' } </button>
            </div>
        </div>
    </footer>
}