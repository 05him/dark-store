import { useNavigate } from 'react-router-dom'

import logo from '../../../assets/pink skull.svg'


export const Logo = () => {

    const navigate = useNavigate();

    const navigateToHome = () => navigate('/')

   return <div className='logo' onClick={navigateToHome} > 
    <img src={logo} alt='dark store logo' />
    <p> DARK-Store </p>
    </div>
}