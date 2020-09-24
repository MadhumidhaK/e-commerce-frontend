import { SET_CATEGORIES } from "../constants/actions";

export default function(state = [], action){
    switch(action.type){
        case SET_CATEGORIES:
            return [...action.payload.categories]
        default: 
            return state
    }
}