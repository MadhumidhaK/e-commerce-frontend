import { SET_ORDER, CLEAR_ORDER } from "../constants/actions"
export default function(state={}, action){
    switch(action.type){
        case SET_ORDER:
            return {
                ...action.payload
            }

        case CLEAR_ORDER: 
            return {}
        default:
            return state
    }
}