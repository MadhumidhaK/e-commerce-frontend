import "./item.css"
import React, { useState } from 'react';
import { Card, CardActionArea, CardActions, CardMedia,  FormControl, InputLabel, Link, makeStyles, Select, } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import fetchPost from '../../utils/fetchPost';
import { useDispatch, useSelector } from 'react-redux';
import { OPEN_TOASTER, SET_CART } from '../../constants/actions';
import { url } from '../../constants/apiURL';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    price:{
        color: "crimson",
        margin: 0
    },
    qty: {
        height: "40px!important"
      }
}));

const Item = ({item}) => {
    const classes = useStyles();
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false)
    
    
    const setItemQuantity = (id, quantity=1) => {
        fetchPost(url+ "/shop/cart/setqty", {
            product: { _id: id},
            quantity
        }, {
            "Authorization": auth.authKey,
            "Content-Type": "application/json"
        }, (response) => { 
            dispatch({
                type: SET_CART,
                payload:{
                    cart: response.cart
                }
            })
            setIsLoading(false);
        }, (response) => {
            dispatch({
                type: OPEN_TOASTER,
                payload: {
                    message: response.error ,
                    severity: "error"
                }
            })
            setIsLoading(false);
        })
    }

    const removeItem = (id) => {
        fetchPost(url+ "/shop/cart/remove", {
            product: { _id: id}
        }, {
            "Authorization": auth.authKey,
            "Content-Type": "application/json"
        }, (response) => { 
            dispatch({
                type: SET_CART,
                payload:{
                    cart: response.cart
                }
            })
            setIsLoading(false);
        }, (response) => {
            dispatch({
                type: OPEN_TOASTER,
                payload: {
                    message: response.error ,
                    severity: "error"
                }
            })
            setIsLoading(false);
        })

    }

    return (
        <Card className={classes.root + " cart-item"}>
            {isLoading && <div className="backdrop"></div>}
            <CardActionArea className="w-150px">
                <Link to={"/product/" + item.product._id}>
                    <CardMedia
                    className={classes.media + " cart-image bg-contain"}
                    image={item.product.productImage}
                    title={item.product.name}
                    />
                </Link>
            </CardActionArea>
            <CardActions className="flex-column justify-space-around align-items-end">
                <h5 className="m-0">{item.product.name.substring(0, 35) + (item.product.name.length > 35 ? "..." : "")}</h5>
                <small className="textSecondary">Seller: <span>{item.product.brand ? item.product.brand : item.product.seller.brandName}</span></small>
                <h5 className={classes.price + " m-0"}>₹ {item.product.price}</h5>
                
                {location.pathname === '/cart' ?  (<div className="flex-row align-items-center">
                            <DeleteIcon className="m-0 p-0 cart-button remove-icon" onClick={() => {
                                setIsLoading(true);
                                return removeItem(item.product._id);
                            }}/>
                    <FormControl variant="outlined" className={classes.qty + " mt-8px"}>
                            <InputLabel>Quantity</InputLabel>
                            <Select
                            className={classes.qty}
                            native
                            value={item.quantity}
                            onChange={(e) => {
                                setIsLoading(true);
                                setItemQuantity(item.product._id, e.target.value)
                            }}
                            label="Quantity"
                            >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            </Select>
                        </FormControl>
                </div>) : <p>Quantity : { item.quantity }</p>}

            </CardActions>
        </Card> 
    )
}

export default Item