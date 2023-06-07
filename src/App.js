import Mockman from "mockman-js";
import { Routes, Route } from 'react-router-dom';

import "./App.css";
import { Home } from './pages/Home/Home';
import { CategoryListing } from "./pages/CategoryListing/CategoryListing";
import { SubCategoryListing } from './pages/SubCategoryListing/SubCategoryListing';
import { SingleProductPage } from "./pages/SingleProduct/SingleProduct";
import { Login } from "./pages/Login/Login";
import { Cart } from "./pages/Cart/Cart";
import { Favourities } from "./pages/Favourities/Favourities";
import { SignUp } from "./pages/SignUp/SignUp";
import { useAuth } from "./context/AuthContext/AuthContext";
import { ShopAll } from "./pages/ShopAll/ShopAll";
import { CheckOut } from "./pages/CheckOut/CheckOut";

function App() {

  const { userData: { isLoggedIn } } = useAuth();

  return (
    <div className="App">
    {/* <Home/> */}
 
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/mockman' element={<Mockman />} />
      <Route path='/category/:categoryName' element={<CategoryListing />} />
      <Route path='/category/:categoryName/:rawSubCategory' element={<SubCategoryListing />} />
      <Route path='/product/:productName/:productID' element={<SingleProductPage />} />
      <Route path='/shopAll/:search' element={<ShopAll />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={ isLoggedIn ? <Home /> : <SignUp />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/favourites' element={<Favourities />} />
      <Route path='/checkout' element={ isLoggedIn ? <CheckOut /> : <Home />} />
    </Routes>

    </div>
  );
}

export default App;
