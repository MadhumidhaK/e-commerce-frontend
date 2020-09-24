import { OPEN_TOASTER, SET_CART } from "../../constants/actions";
import { url } from "../../constants/apiURL";
const { default: fetchPost } = require("../../utils/fetchPost");


export default function addToCart(id, quantity, setIsLoading, dispatch, auth ){
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