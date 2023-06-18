import { useAuth } from '../../../context/AuthContext/AuthContext'

import logo from '../../../assets/pink skull.svg'


export const Logo = () => {

    const { navigate } = useAuth()

    const navigateToHome = () => navigate('/')

   return <div className='logo' onClick={navigateToHome} > 
    <img src={logo} alt='dark store logo' />
    <p> DARK-Store </p>
    </div>
}