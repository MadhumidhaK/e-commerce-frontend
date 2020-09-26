import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { url } from '../../constants/apiURL';
import { useFetch } from '../../hooks/useFetch';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import addToCart from './addToCart';

const useStyles = makeStyles({
    productImage:{
        height: "360px",
        width: "360px",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        minWidth: "360px",
        backgroundPosition: "center"
    },
    desc:{
        color: "grey",
        margin: 0
    },
    warning:{
        color: "orangered"
    },
    brandLink: {
        color: "blue!important",
        '&:hover': {
            color: "#2121ce!important"
        }
    },
    price:{
        color: "crimson",
        margin: "10px"
    }
});


const ProductDetails = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const classes = useStyles();
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
   

    const successCB = (response) => {
        setProduct(response.product);

    }
    const errorCB = (response) => {
        setError(response.error);
    }

   useFetch( url + "/product/p/" + id ,{}, successCB, errorCB);
    return (
        <Box>
            {!product ? <CircularProgress /> :  
            <div className="product m-1rem">
                <div className={classes.productImage} style={{"backgroundImage": "url(" + product.productImage + ")"}}></div>
                <div>
                        <h3>{product.name}</h3>
                        <h4 className={classes.price}>₹ {product.price}</h4>
                        {auth.isLoggedIn && 
                        <> 
                        {isLoading ? <CircularProgress /> : <Button size="small"  variant="contained" color="primary" className="ml-auto" onClick={() => {
                                            setIsLoading(true);
                                            addToCart(product._id, 1, setIsLoading, dispatch, auth)
                                         }}>
                                        Add to Cart
                        </Button>
                        }
                        </>}
                        {product.availableQuantity < 10 && 
                        <div 
                            className={classes.warning +" flex-row align-items-center justify-content-center ml-auto small mt-1"}>
                            <WarningRoundedIcon /> 
                            <span>  Only {product.availableQuantity} left in stock</span>
                         </div>}
                         <div className="m-1rem">
                            Seller: <Link to={'/brand/'+ product.seller.brand} className={classes.brandLink}>{product.seller.brandName}</Link>
                         </div>
                        <p>{product.description}</p>
                </div>
            </div>
            }
        </Box>
    )
}

export default ProductDetails;