import { CLEAR_USER_DATA, SET_USER_DATA } from "../constants/actions";

export default function(state = {
    email: "",
    firstName:"",
    lastName: "",
    brandName: "",
    brand: "",
    isSeller: false
}, action){
    switch(action.type){
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload.user
            }
        case CLEAR_USER_DATA:
            return {
                email: "",
                firstName:"",
                lastName: "",
                brandName: "",
                brand: "",
                isSeller: false
            }
        default: 
            return state
    }
}