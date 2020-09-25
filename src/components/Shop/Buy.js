import { Box, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import useButtonStyles from '../../styles/useButtonStyles';
import DisplayItems from './DisplayItems';

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script); 
        script.onload = () => {
            resolve(true);
        } 
        script.onerror = () => {
            resolve(false)
        }
    })    
}

const Buy = () => {
    const user = useSelector(state => state.user);
    const order = useSelector(state => state.order);
    const {orderBtn} = useButtonStyles();
    const [orderCompleted, setOrderCompleted] = useState(false);
    async function displayRazorPay(){
        const isScriptLoaded = await  loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!isScriptLoaded){
            alert("Razorpay is not loaded. Please check your internet connection.")
        }
        var options = {
            key: "rzp_test_hnzAt2UNZiOyTa", 
            amount: order.amount,
            currency: order.currency,
            name: "Happy Shop",
            description: "Online Transaction",
            image: "https://image.freepik.com/free-vector/happy-shop-logo-template_57516-57.jpg",
            order_id: order.orderID, 
            handler: function (response){
                setOrderCompleted(true);
            },
            prefill: {
                name: user.firstName + " " + user.lastName,
                email: user.email,
                contact: "9999999999"
            },
            notes: {
                address: "Happy Shop Corporate Office"
            },
            theme: {
                color: "#F37254"
            } 
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    if(!order.items || order.items.length < 1) {
       return <Redirect to="/cart"></Redirect>
    }
    return (
        <div>
                <Box display="flex" flexWrap="wrap" justifyContent="center">
                    {order?.items?.length > 0 && <DisplayItems items={order.items} />}
                    <Box className="cart-details">
                        <h4>Total :₹  {order.total}</h4>
                        {orderCompleted ?    (  
                            <Alert severity="success" className="m-1rem">
                                    <AlertTitle>Payment Completed!</AlertTitle>
                                    Your order is confirmed. Your Order Number :<strong>{order._id}</strong>
                            </Alert>) 
                        :
                         <Button onClick={displayRazorPay} className={orderBtn}>Make Payment</Button>}
                    </Box>
                </Box>
                
        </div>
    )
}

export default Buy;