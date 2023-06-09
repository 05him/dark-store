import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Heading } from '../components/Heading/Heading';
import { Navbar } from '../components/Navbar/Navbar';
import { useToastAndLoader } from '../../context/ToastAndLoaderContext/ToastAndLoaderContext';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { Footer } from "../components/Footer/Footer";
import openEye from '../../assets/open-eye.svg';
import closeEye from '../../assets/close-eye.svg';

export const Login = () => {

    const { setToast, isLoading, setLoader } = useToastAndLoader();
    const { userData, handleUserLogin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [ passwordType, setPasswordType ] = useState('password');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleLoginWithTestData = async() => {
        setLoader(true);
        try{
        const testLoginCall = await axios.post('/api/auth/login',{ email: 'admin', password: 'admin' });
        setToast('LoggedIn Successfully', 'success')
        handleUserLogin(testLoginCall.data.foundUser, testLoginCall.data.encodedToken);
        setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
        setTimeout(()=> navigate(location?.state?.pathname), 4000 )
        setTimeout(()=>setLoader(false), 4000 )
        }
        catch(eror){
            setToast(eror);
        }
        // setToast(`Welcome ${firstName} ${lastName} `, 'success')
    }

    const handleLogin = async(e) => {
        e.preventDefault();
        if( email.trim().length===0 || password.trim().length===0 ){
            setToast('Password and email cannot be empty', 'warning');
        }
        else{
            setLoader(true);        
            try{
            const loginCall = await axios.post('/api/auth/login',{ email: email , password: password });
            if( loginCall.status===200 ){
                setToast('LoggedIn Successfully', 'success')
            handleUserLogin(loginCall.data.foundUser, loginCall.data.encodedToken);
            setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
            setTimeout(()=> navigate(location?.state?.pathname), 4000 )
            setTimeout(()=>setLoader(false), 4000 )
            }
        }
        catch(eror){
           setToast(eror.response.data.errors, 'error');
        }
    }
    }

    // updateLocalStorage();

    return <>
            <Navbar />
            <Heading title={'login'} />
            <div className='login-signup-area' >
                <form>
                    <label> Username/email <input type='text' required placeholder='admin' value={email} onChange={ e => setEmail(e.target.value) } /> </label>
                    <label className='password-label' > Password <input type={passwordType} placeholder='admin' onChange={ e => setPassword(e.target.value) } required /> <img src={ passwordType==='password' ? closeEye : openEye } alt='password show hide' className='show-hide-icon' onClick={ () => passwordType==='password' ? setPasswordType('text') : setPasswordType('password') } /></label>
                    <button className='login-api-btn' onClick={ handleLogin } > Login </button>
                </form>
                <div className='' >
                <button onClick={handleLoginWithTestData} className='test-login-btn' > Login with Test Credentials </button> 
                <div className='signup-msg' onClick={ ()=> navigate('/signup') } > dont have a account ? <button className='signup-btn' > Sign Up </button> </div>
                </div>
            </div>
            <Footer/>
        </>
}