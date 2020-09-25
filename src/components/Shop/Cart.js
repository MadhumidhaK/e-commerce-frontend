import "./Cart.css";
import { Box, CircularProgress } from '@material-ui/core';
import React, { useState} from 'react';
import Button from '@material-ui/core/Button';


import { useDispatch, useSelector } from 'react-redux';
import { url } from '../../constants/apiURL';
import { useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { CLEAR_CART, OPEN_TOASTER,  SET_ORDER } from '../../constants/actions';
import fetchPost from "../../utils/fetchPost";
import useButtonStyles from "../../styles/useButtonStyles";
import Item from "./Item";



const Cart = function (){
    const {orderBtn} = useButtonStyles();

    const auth = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const history = useHistory();

    
    const order = () => {
        setIsCreatingOrder(true);
        fetchPost(url+ "/shop/cart/order", {}, {
            "Authorization": auth.authKey,
            "Content-Type": "application/json"
        }, (response) => { 
            dispatch({
                type: OPEN_TOASTER,
                payload: {
                    message: "Your order is placed, please complete the payment to complete your order.",
                    severity: "success"
                }
            })

            dispatch({
                type: SET_ORDER,
                payload: {
                        ...response
                }
            })
            dispatch({
                type: CLEAR_CART
            });
            setIsCreatingOrder(false);

            history.push("/buy");
        }, (response) => {
            setIsCreatingOrder(false);
            setError(error);
            dispatch({
                type: OPEN_TOASTER,
                payload: {
                    message: response.error ,
                    severity: "error"
                }
            })
        })
    }
    

    if(error){
    return (
        <Alert severity="error" className="message-style">
            <AlertTitle><strong>{error}</strong></AlertTitle>
            Please check again Later!
        </Alert>
        )
    }

    if(cart.items.length < 1){
        return (
            <Alert severity="error" className="message-style">
                <AlertTitle><strong>There are no items in your cart.</strong></AlertTitle>
                Please add items to your cart to view here.
            </Alert>
            )
    }
    return (
        <div>
           <Box display="flex" flexWrap="wrap" justifyContent="center">
               {cart.items.length > 0 && 
               <Box flexDirection="row" flexWrap="wrap" className="cart-items">    
                {cart.items.map((item, index) => {
                    return (
                        <Item key={index} item={item}/>
                    )
                })}
                </Box>}
               <Box className="cart-details">
                <h4>Total : ₹  {cart.total}</h4>
                {isCreatingOrder ?    <CircularProgress />    : <Button className={orderBtn} onClick={() => {
                    order()
                }}>Place order</Button>}
                </Box>
           </Box>
        </div>
    )
}

export default Cart;