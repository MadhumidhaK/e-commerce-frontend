import './Cart.css';
import {  CircularProgress, List, ListItem, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { url } from '../../constants/apiURL';
import useQuery from '../../hooks/useQuery';
import fetchData from '../../utils/fetchData';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column"
    },
    
    listItem: {
        margin: "1rem",
        display: "block",
        width: "97%",
        marginLeft: "auto",
        marginRight: "auto"
    }
  }));

const Orders = () => {
    const classes = useStyles();
    const auth = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    let query = useQuery();
    let currentPage = query.get("page");
    if(!currentPage || currentPage === 0){
        currentPage = 1;
    }
    
    
    const successCB = (response) => {
        setOrders(response.orders);
    }
    const errorCB = (response) => {
        setError(response.error);
    }

    useEffect(() => {
        const getData = async () => {
            await fetchData( url + "/shop/orders", {
                "Authorization": auth.authKey,
                "Content-Type": "application/json"
            }, successCB, errorCB);
            setIsLoading(false);
        }
        getData();
    },[])

    if(isLoading){
        return <CircularProgress />
    }

    if(orders.length < 1){
        return (
            <Alert severity="error" className="message-style">
                <AlertTitle><strong>No orders!</strong></AlertTitle>
            </Alert>
            )
    }
    return (
        <List className={classes.root}>
                {orders.map((order, index) => {
                    return (
                        <ListItem key={index} className={classes.listItem + (order.isPaid? " order-success p-0" : " order-failed p-0")} >
                            <div className="order-title">
                                <div className="flex-column">
                                    <small>
                                        Order ID: 
                                    </small>
                                    <small>
                                        <strong>
                                        #{order._id}
                                        </strong>
                                    </small>
                                </div>
                                <div className="flex-column">
                                    <small>
                                        Order Placed: 
                                    </small>
                                    <small>
                                        <strong>
                                            {new Date(order.createdAt).toDateString()}
                                        </strong>
                                    </small>
                                </div>
                                <div className="flex-column">
                                    <small>
                                        Total:
                                    </small>
                                    <small>
                                        <strong>
                                        ₹ {order.total}
                                        </strong>
                                    </small>
                                </div>
                            </div>

                            
                            <div className="flex-row justify-space-between">
                                <small className="m-0 p-0">Items: <strong>{order.items.length}</strong></small>
                                {false && <small><strong><Link className="order-link" to={"/order/"+ order._id}>Order Details</Link></strong></small>}
                            </div>
                            {
                                !order.isPaid &&
                                <Alert severity="error" className="order-info">
                                    <AlertTitle>Your Payment Failed!</AlertTitle>
                                    This order is not completed
                                </Alert>
                            }
                            <div className="flex-column align-items-center justify-content-center">
                                {order.items.map((item, index) => {
                                    return (
                                    <div className="flex-row align-items-center">
                                        <Link to={"/product/" + item.product._id}>
                                            <div className="order-item-img" style={{"backgroundImage":"url("+ item.product.productImage + ")"}}></div>
                                        </Link>
                                        <div>
                                            <small className="m-0 p-0 display-block">
                                                <strong>{item.product.name.substring(0, 20) + (item.product.name.length > 20 ? "..." : "")}</strong>
                                            </small>
                                            <small className="m-0 p-0 display-block">Quantity : {item.quantity}</small>
                                            <small className="m-0 p-0 display-block">₹ {item.product.price}</small>
                                            <small className="m-0 p-0 display-block">Seller : {item.product.brand}</small>
                                        </div>
                                    </div>)
                                })}
                            </div>
                        </ListItem>
                    )
                })}
            </List>       
    )

}

export default Orders;