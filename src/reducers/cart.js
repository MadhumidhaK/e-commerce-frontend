import { CLEAR_CART, SET_CART } from "../constants/actions";

export default function(state = {
    items: [],
    total: 0
}, action){
    switch(action.type){
        case SET_CART: 
            return {
                ...action.payload.cart
            }
        case CLEAR_CART:
            return {
                items: [],
                total: 0
            }
        default:
            return state
    }
}