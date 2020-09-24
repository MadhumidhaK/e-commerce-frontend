import React, {  useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import NavBar from './components/NavBar/NavBar';
import CategoriesNav from './components/NavBar/CategoriesNav';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import AlertDialogSlide from './components/Alert/Alert';
import Home from './components/Home/Home';

import { useDispatch } from 'react-redux';


import { url } from './constants/apiURL';
import { LOGGED_IN, LOGGED_OUT, SET_CART, SET_CATEGORIES, SET_USER_DATA } from './constants/actions';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import UserInformation from './components/UserInformation/UserInformation';
import { store } from './store';
import { useFetch } from './hooks/useFetch';
import Toaster from './components/Toaster/Toaster';
import RequestEmailVerification from './components/Auth/RequestEmail';
import ResetPassword from './components/Auth/ResetPassword';
import Products from './components/Products/Products';
import ProductForm from './components/Seller/ProductForm';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Shop/Cart';
import Buy from './components/Shop/Buy';
import Orders from './components/Shop/Orders';
import PageNotFound from './components/PageNotFound/PageNotFound';


function App() {
  const dispatch = useDispatch();
  const storedToken = window.localStorage.getItem('happy-shop');
  
  const [isVerifying, setIsVerifying] = useState(true)
  
  
    const successCB = function(response){
      
      dispatch({
        type: SET_USER_DATA,
        payload: {
          user: {
            ...response.user
          }
        }
      })
      dispatch({
        type: SET_CART,
        payload:{
          cart: response.cart
        }
      })
      dispatch({
        type: LOGGED_IN,
        payload: {
          authKey: storedToken
        }
      })
      setIsVerifying(false)
    }
    const failedCB = function(){
      dispatch({
        type: LOGGED_OUT
      })
      window.localStorage.removeItem('happy-shop')
      setIsVerifying(false)

    }
    useFetch(url + "/user/verifytoken", {
      method: "GET",
      headers: {
          "Authorization": storedToken
      }
    }, successCB, failedCB);

    useFetch(url + "/product/categories", {
      method: "GET"
    }, function(response){
      console.log('response')
      console.log(response)
     dispatch({
         type: SET_CATEGORIES,
          payload: {
              categories: response.categories
          }
     });
  } );

  store.subscribe(() => {console.log(store.getState())})

  return (
    <Router>
      <div className="App">
        <NavBar />
        <CategoriesNav />
        <Switch>
          <Route key="home" exact path="/"><Home /></Route>
          <Route key="login" exact path="/login"><Login /></Route>
          <Route key="signup" exact path="/signup"><Signup /></Route>
          <Route key="verify-email" exact path="/verify/:token"><VerifyEmail /></Route>
          <Route key="reset-password" exact path="/reset/:token"><ResetPassword /></Route>
          <Route key="request-email" exact path="/request/:action"><RequestEmailVerification /></Route>
          <Route key="product" exact path="/product/:id"><ProductDetails /></Route>
          <PrivateRoute key="user-info" exact path="/user" isVerifying={isVerifying} component={UserInformation}></PrivateRoute>
          <PrivateRoute key="add-product" exact path="/add-product" isVerifying={isVerifying} component={ProductForm}></PrivateRoute>
          <PrivateRoute key="edit-product" exact path="/edit-product/:id" isVerifying={isVerifying} component={ProductForm} ></PrivateRoute>
          <PrivateRoute key="cart" exact path="/cart" isVerifying={isVerifying} component={Cart}></PrivateRoute>
          <PrivateRoute key="buy" exact path="/buy" isVerifying={isVerifying} component={Buy}></PrivateRoute>
          <PrivateRoute key="orders" exact path="/orders" isVerifying={isVerifying} component={Orders}></PrivateRoute>
          <Route exact path="/:filterBy/:name" render={props => <Products key={Date.now()} {...props}/> }></Route>
          <Route path="/"><PageNotFound /></Route>
        </Switch>
        <AlertDialogSlide />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
