import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../context/AuthContext/AuthContext";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import { Heading } from "../components/Heading/Heading";

export const CheckOut = () => {

    const navigate = useNavigate();
    const { userData: { authToken } } = useAuth();
    const { setToast, setLoader, isLoading } = useToastAndLoader();
    const [ addressList, setAddressList ] = useState([{ userName: 'Temp Username', number: '99999999', address: 'India' }]);
    const [ userName, setUserName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ number, setNumbmer ] = useState('');

    const [ showAddAddress, setShowAddAddress ] = useState(false);

    // const fetchAddress = async () => {
    //     setLoader(true);
    //     try{
    //     const addressCall = await axios.get('/api/user/addressList', { headers : { 'authorization' : authToken } });
    //     setAddressList(addressCall.data.addressList);
    //     }
    //     catch(eror){
    //         alert(eror);
    //     }
    //     finally{
    //         setLoader(false)
    //     }
    // }

    const { updateCartHandler } = useAuth();

    const handleNewbtn = () => {

    }

    const handleAddBtn = async (e) => {
        e.preventDefault()
        if( userName.trim().length===0 || address.trim().length===0 || number.trim().length===0 ){
            setToast('please fill all inputs', 'warning');
        }
        else{
            setAddressList( list => [ ...list,  { userName: userName, address: address, number: number }]);
            setToast('Address added successfully', 'success');
        }
    }

    // useEffect( () => {
    //     fetchAddress();
    // },[] )

    const placeOrder = () =>{
        setToast('order placed successfully', 'success');
        updateCartHandler([]);
        setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
        setTimeout(()=> navigate('/'), 4000 )
        setTimeout(()=>setLoader(false), 4000 )
    }

    return <>
    <Navbar />
    { (!isLoading && addressList.length===0 ) && <Heading title={ 'no saved address found' } /> }
    <ul className="address-list" >
    { 
        addressList?.map( ({ userName, address, number},index) => <li key={index} > <div> { userName } </div> <div> {address} </div> <div> {number} </div> <button onClick={ placeOrder } > use this address </button>  </li> )
     }
     </ul>
    {/* <button className="add--new-address-btn" onClick={ handleNewbtn } > Add New Address </button> */}
    <div className="add-address-cntainer"> 
    <form>
    <label> <input required value={userName} onChange={ e => setUserName(e.target.value) } type='text' /> Name </label>
    <label> <input required value={address} onChange={ e => setAddress(e.target.value) } type='text' /> Address </label>
    <label> <input required value={number} onChange={ e => setNumbmer(e.target.value) } type='number' /> Number </label>
    <button onClick={ handleAddBtn } > Add Address </button>
    </form>
     </div>
    <Footer />
    </>
}