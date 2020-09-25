import { Card, CardActionArea, CardActions, CircularProgress, makeStyles, Tooltip } from '@material-ui/core';
import React, {  useState} from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { useDispatch, useSelector } from 'react-redux';
import { url } from '../../constants/apiURL';
import { Link } from 'react-router-dom';
import { OPEN_TOASTER, SET_CART } from '../../constants/actions';
import fetchPost from '../../utils/fetchPost';


const useStyles = makeStyles({
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
    warning:{
        color: "orangered"
    }
});

const Product = ({filterBy, name, ...others}) =>{
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(others.product)
    const [isLoading, setIsLoading] = useState(false)

    const addToCart = (id, quantity) => {
        fetchPost(url+ "/shop/cart/add", {
            product: { _id: id},
            quantity
        }, {
            "Authorization": auth.authKey,
            "Content-Type": "application/json"
        }, (response) => { 
            dispatch({
                type: OPEN_TOASTER,
                payload: {
                    message: "Added to Cart",
                    severity: "success"
                }
            })
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
    };

    const imageUpload = function(e, id){
        if(e.target.files[0]){
            fetchPost(url + "/product/updateimage/"+ id, { productImage:  e.target.files[0]}, {
                "Authorization": auth.authKey
            }, (response) => {
                setProduct({
                    ...response.product
                })
                setIsLoading(false)
            }, (response) => {
            }, "PUT" ,true )
        }
    }

    const deleteProduct = function(id){
        fetchPost(url + "/product/delete/"+ id, {}, {
            "Authorization": auth.authKey
        }, (response) => {
            if(response.success){
                setProduct(null);
            }
        }, (response) => {
            console.log(response)
        }, "DELETE" )
    }
    if(!product){
        return <></>
    }
    return (
        <Card className={classes.root + " card-style"}>
            <CardActionArea>
                <Link to={"/product/" + product._id}>
                    <CardMedia
                    className={classes.media + " card-media"}
                    image={product.productImage}
                    title={product.name}
                    />
                    <CardContent>
                        <Typography gutterBottom color="textPrimary" variant="h6" component="h4">
                            {product.name.substring(0, 20) + (product.name.length > 20 ? "..." : "")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="div">
                            {product.description.substring(0, 20) + (product.description.length > 20 ? "..." : "")}
                            {product.availableQuantity < 10 && 
                            <div 
                            className={classes.warning +" flex-row align-items-center ml-auto small position-absolute"}>
                            <WarningRoundedIcon /> 
                            <span>  Only {product.availableQuantity} left in stock</span>
                            </div>}
                        </Typography>
                    </CardContent>
                </Link>
            </CardActionArea>
            <CardActions>
                {auth.isLoggedIn &&  user.isSeller &&
                        user.brand === product.seller.brand && filterBy === 'brand' ? 
                    <div className="flex-row justify-space-between align-items-center w-100">
                        <Link to={"/edit-product/" +product._id }>
                            <Button size="small" color="primary">
                            Edit 
                            </Button>
                        </Link>
                        <Button size="small" color="primary" onClick={() => {
                            deleteProduct(product._id);
                        }}>
                            Delete
                        </Button>
                        {isLoading ? <CircularProgress /> : <><input
                            accept="image/*"
                            onChange={(e) => {
                                setIsLoading(true)
                                imageUpload(e, product._id)
                            }}
                            name="productImage"
                            style={{ display: 'none' }}
                            id={"productImage_" + product._id}
                            type="file"
                            />
                        <label htmlFor={"productImage_" + product._id}>
                                <Button size="small"  component="span"  color="primary">
                                    Edit Image
                                </Button>
                        </label></>}
                    </div>
                :
                
                    <>
                        <h2 className={classes.price}>₹ {product.price}</h2>
                        {auth.isLoggedIn  && 
                            <>
                                {isLoading ? 
                                    <CircularProgress  className="ml-auto"/> 
                                :
                                <Button size="small" color="primary" className="ml-auto" onClick={() => {
                                    setIsLoading(true);
                                    addToCart(product._id, 1)
                                    }}>
                                    <Tooltip title="Add to your Cart">
                                        <AddShoppingCartIcon />
                                    </Tooltip>
                                </Button>
                                }
                            </>
                        }
                    </>
                }
            </CardActions>
        </Card>
    )
}


export default Product;