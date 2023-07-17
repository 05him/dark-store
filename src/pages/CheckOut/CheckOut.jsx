import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../context/AuthContext/AuthContext";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import { Heading } from "../components/Heading/Heading";
import { tr } from "@faker-js/faker";

const handleAddressReducer = (data, action) => {
    switch (action.type){
        case 'handleInput' : return({ ...data, [action.inputName]: action.inputValue });
        case 'handleEdit' : return({...data, ...action.editAddressData });
        default: throw Error(`some error in handling ${action.type}`);
    }
}



export const CheckOut = () => {

    const navigate = useNavigate();
    const [ editAddressInfo, setEditAddressInfo ] = useState(null);
    const [ showModal, setShowModal ] = useState(false);
    const { userData: { userAddressList }, apiHeader, updateAddressHandler } = useAuth();
    const { setToast, setLoader, isLoading } = useToastAndLoader();

    const AddressModal = () => {

        const [ addressDetails, setAddressDetaisl] = useReducer(handleAddressReducer, { addressName: '', flatNo: '', area: '', landmark: '', cityState: '', pinCode: '', phoneNumber: '' })

        const { _id, addressName, flatNo, area, landmark, cityState, pinCode, phoneNumber } = addressDetails;
    
        const handleInput = ( inputName, inputValue ) => setAddressDetaisl({ type: 'handleInput', inputName: inputName, inputValue: inputValue });

        const handleEditAddress = obj => setAddressDetaisl({ type: 'handleEdit', editAddressData: obj });

        useEffect( () => {
            if(editAddressInfo){
                handleEditAddress(editAddressInfo);
            }
        },[] )
    
        const handleCancelClick = (e) => {
            e.preventDefault();
            setShowModal(false);
        }

        const handleAddBtn = async (e, id) => {
            e.preventDefault();
            if( addressName.trim().length===0 || flatNo.trim().length===0 || area.trim().length===0 || landmark.trim().length===0 || cityState.trim().length===0 || pinCode.trim().length===0 || phoneNumber.trim().length===0 ){
                setToast('Input fileds cant be empty', 'warning');
            }
            else if( editAddressInfo ) {
                setLoader(true)
                try{
                    const editCall = await axios.post(`/api/user/addressList/${id}`, { address: { addressName: addressName, flatNo: flatNo, area: area, landmark: landmark, cityState: cityState, pinCode: pinCode, phoneNumber: phoneNumber } } , apiHeader);
                    updateAddressHandler(editCall.data.addressList);
                    setToast('address updated', 'success');
                    setEditAddressInfo(null);
                    setShowModal(false);
                }
                catch(eror){
                    console.log(eror);
                }
                finally{
                    setLoader(false)
                }
            }
            else{
                setLoader(true)
                try{
                    const addCall = await axios.post('/api/user/addressList', { address: { addressName: addressName, flatNo: flatNo, area: area, landmark: landmark, cityState: cityState, pinCode: pinCode, phoneNumber: phoneNumber } }, apiHeader );
                    setToast('Address Saved','success')
                    updateAddressHandler(addCall.data.addressList);
                    setShowModal(false);
                }
                catch(eror){
                    alert(eror);
                }
                finally{
                    setLoader(false);
                }
            }
        }
    
        return  <div className="add-address-modal" style={{ display: showModal ? 'block' : 'none' }} >
        <div className="add-address-container"> 
        <form>
        <label> Name <input required type='text' value={ addressName } onChange={ e=>handleInput( 'addressName', e.target.value) } /> </label>
        <label> H.No/Flat No. <input required type='text' value={ flatNo } onChange={ e=>handleInput( 'flatNo', e.target.value) } /> </label>
        <label> Area/Street/Colony <input required type='text' value={ area } onChange={ e=>handleInput( 'area', e.target.value) } /> </label>
        <label> Landmark <input type='text' value={ landmark } onChange={ e=>handleInput( 'landmark', e.target.value) } /> </label>
        <label> City, State <input required type='text' value={ cityState } onChange={ e=>handleInput( 'cityState', e.target.value) } /> </label>
        <label> Pin Code <input required type='number' value={ pinCode } onChange={ e=>handleInput( 'pinCode', e.target.value) } /> </label>
        <label> Phone Number <input required type='number' value={ phoneNumber } onChange={ e=>handleInput( 'phoneNumber', e.target.value) } /> </label>
        <button onClick={ e => handleAddBtn(e, _id) } > { !editAddressInfo ? 'Add Address' : 'Save Changes'  } </button>
        <button onClick={ handleCancelClick } > Cancel </button>
        </form>
         </div>
         </div>
    }

    // const placeOrder = async() =>{
    //     setLoader(true);
    //     const clearCall = await axios.delete('/api/user/cart/empty', { headers: { 'authorization': authToken } });
    //     updateCartHandler(clearCall.data.cart);
    //     setToast('order placed successfully', 'success');
    //     setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
    //     setTimeout(()=> navigate('/'), 4000 )
    //     setTimeout(()=>setLoader(false), 4000 )
    // }

    const handleEdit = async address => {
        setShowModal(true);
        setEditAddressInfo(address);
    }

    const handleAddressDelete = async id => {
        setLoader(true)
        try{
            const deleteCall = await axios.delete(`/api/user/addressList/${id}`, apiHeader );
            setToast('address removed', 'success');
            updateAddressHandler(deleteCall.data.addressList);
        }
        catch(eror){
            alert(eror);
        }
        finally{
            setLoader(false);
        }
    }

    return <>
    <Navbar />
    <Heading title={'CheckOut'} />
    <AddressModal />
    <div>
    { userAddressList.length===0 && <div> No saved address found </div> }
    <ul>
        { userAddressList?.map( address => {
            const {_id, addressName, flatNo, area, landmark, cityState, pinCode, phoneNumber} = address;
            return <li key={_id} className="address-container" > 
            <div className="address-name" > {addressName} </div>
            <div> {phoneNumber} </div>
            <div> {flatNo},  {area}. <br /> LandMark - {landmark} </div>
            <div> {cityState} </div>
            <div> {pinCode} </div>
            <button> Use this address </button>
            <button onClick={ () => handleEdit(address) } > Edit address </button>
            <button onClick={ () => handleAddressDelete(_id) } > Delete Address </button>
             </li>} ) }
    </ul>
    <button className="add--new-address-btn" onClick={ () => setShowModal(value => !value) } > Add New Address </button>
    </div>
    <div> 

    </div>
    <Footer />
    </>
}