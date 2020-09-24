import { LOGGED_IN, LOGGED_OUT } from "../constants/actions";

export default function(state = {}, action){
    switch (action.type){
        case LOGGED_IN: 
            return {
                isLoggedIn: true,
                authKey: action.payload.authKey
            }
        case LOGGED_OUT: 
            return {
                isLoggedIn: false,
                authKey: undefined
            }
        default: 
        return state
    }
}