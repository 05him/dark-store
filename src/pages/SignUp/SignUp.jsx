import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Heading } from "../components/Heading/Heading"
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import openEye from '../../assets/open-eye.svg';
import closeEye from '../../assets/close-eye.svg';
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";

export const SignUp = () => {
    const [ passwordType, setPasswordType ] = useState('password');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const { setToast, setLoader } = useToastAndLoader();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if( email.trim().length===0 || password.trim().length===0 || firstName.trim().length==0 || lastName.trim().length===0 ){
            setToast('Please fill all input fields', 'warning');
        }
        else{
            setLoader(true);        
            try{
            const signInCall = await axios.post('/api/auth/signup',{ email: email , password: password, firstName: firstName, lastName: lastName });
            if( signInCall.status===201 ){
                setToast('account created Successfully, you can now login', 'success')
            setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
            setTimeout(()=> navigate('/'), 4000 )
            setTimeout(()=>setLoader(false), 4000 )
            }
        }
        catch(eror){
           setToast(eror.response.data.errors, 'error');
        }
    }
    }

    return <>
    <Navbar />
    <Heading title={'SignUp'} />
    <div className="login-signup-area" >
        <form>
            <label> First Name <input autoComplete="false" required value={firstName} onChange={ e => setFirstName(e.target.value) } type='text' /></label>
            <label> Last Name <input autoComplete="false" required value={lastName} onChange={ e => setLastName(e.target.value) } type='text' /> </label>
            <label> Email <input autoComplete="false" required value={email} onChange={ e => setEmail(e.target.value) } type='text' /> </label>
            <label className='password-label' > Password <input autoComplete="false" type={passwordType} placeholder='admin' onChange={ e => setPassword(e.target.value) } required /> <img src={ passwordType==='password' ? closeEye : openEye } alt='password show hide' className='show-hide-icon' onClick={ () => passwordType==='password' ? setPasswordType('text') : setPasswordType('password') } /></label>
            <button className="create-account-btn" onClick={ handleCreateAccount } > Create Account </button>
        </form>
    </div>
    <Footer/>
    </>
}