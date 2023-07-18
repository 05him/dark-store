import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../context/AuthContext/AuthContext";
import { useToastAndLoader } from "../../context/ToastAndLoaderContext/ToastAndLoaderContext";
import { Navbar } from "../components/Navbar/Navbar";
import { useProducts } from "../../context/ProductsContext";
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
    const [ selectedAddress, setSelectedAddress ] = useState('');
    const { userData: { userAddressList, userCart }, apiHeader, updateAddressHandler, updateCartHandler } = useAuth();
    const { setToast, setLoader, isLoading } = useToastAndLoader();
    const { calculateFinalPrice } = useProducts();

    const totalPrice = userCart?.reduce( (total, {price, discount, qty=1}) => total + calculateFinalPrice(price,discount)*qty ,0 );
    const totalItems = userCart?.length;
    const totalQuantity = userCart?.reduce( (total,{qty=1}) => total+qty,0 );

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
        <button onClick={ e => handleAddBtn(e, _id) } className="add-address-primary-btn" > { !editAddressInfo ? 'Add Address' : 'Save Changes'  } </button>
        <button onClick={ handleCancelClick } className="add-address-secondary-btn" > Cancel </button>
        </form>
         </div>
         </div>
    }

    const placeOrder = async() =>{
        if(selectedAddress.length===0){
            setToast('Select a address first', 'warning')
        }
        else{
            setLoader(true);
            const clearCall = await axios.delete('/api/user/cart/empty', apiHeader);
            updateCartHandler(clearCall.data.cart);
            setToast('order placed successfully', 'success');
            setTimeout(()=> setLoader(true, 'Redirecting....') , 2000 )
            setTimeout(()=> navigate('/'), 4000 )
            setTimeout(()=>setLoader(false), 4000 )
        }
    }

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
    <div className="checkout-main" >
    <div className="saved-address-container" >
        <div className="saved-address-head" > Saved Address  </div>
    { userAddressList.length===0 && <div className="text-align-center" > No saved address found </div> }
    <ul>
        { userAddressList?.map( address => {
            const {_id, addressName, flatNo, area, landmark, cityState, pinCode, phoneNumber} = address;
            return <li key={_id} className="address-container" > 
            <div className="address-name" > {addressName} </div>
            <div> {phoneNumber} </div>
            <div> {flatNo},  {area}. <br /> LandMark - {landmark} </div>
            <div> {cityState} </div>
            <div> {pinCode} </div>
            <button onClick={ () => setSelectedAddress(address) } > Use this address </button>
            <button onClick={ () => handleEdit(address) } > Edit address </button>
            <button onClick={ () => handleAddressDelete(_id) } > Delete Address </button>
             </li>} ) }
    </ul>
    <button className=" add-address-primary-btn add-new-address-btn " onClick={ () => setShowModal(value => !value) }  > Add New Address </button>
    </div>
    <div className="summary-container" > 
        <div className="summary-head" > Summary </div>
    { userCart.length!==0 &&
        <div className="carts-details-container" >
          <div className="cart-details-heading" > cart details </div>
          <div className="qty-info-container" > <span className="qty-info-heading" > Total Items: {totalItems} </span> <span className="qty-info-heading" > Total Quantity: {totalQuantity} </span> </div>
          {
            userCart?.map( ({_id, title, price, discount, qty=1}) => <div key={_id} className="product-desc-container" > <div className="product-desc-title" > { title } </div> <div className="product-quantity-price-container" >  <span className="product-desc-quantity-container" > <span className="product-desc-quantity-heading" > Quantity </span> : <span className="product-desc-quantity"> {qty} </span> </span> <span className="product-desc-price-container" > <span className="product-desc-price-heading">  Price: </span> <span className="product-desc-price" > ₹{ calculateFinalPrice(price,discount)*qty } </span> </span> </div>  </div> )
          }
          
          <div className="total-price-container" > <span className="total-price-heading" > Total price: </span>  <span className="total-price" > ₹{totalPrice} </span> </div>
          <button onClick={ placeOrder } className="place-order-btn" > Place Order </button>
          <div>
            Selected Address: { selectedAddress.length===0 && <div> <i> No address selected </i> </div> }
            {
                selectedAddress.length!==0 && <div>
                
                    <div className="address-name" > {selectedAddress?.addressName} </div>
            <div> {selectedAddress?.phoneNumber} </div>
            <div> {selectedAddress?.flatNo},  {selectedAddress?.area}. <br /> LandMark - {selectedAddress?.landmark} </div>
            <div> {selectedAddress?.cityState} </div>
            <div> {selectedAddress?.pinCode} </div>
                     </div>
            }
        </div>
        </div> }
        
    </div>
    </div>
    <Footer />
    </>
}