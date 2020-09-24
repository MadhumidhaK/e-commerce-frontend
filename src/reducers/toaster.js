import { OPEN_TOASTER, CLOSE_TOASTER } from "../constants/actions";

export default function(state ={
    open: false,
    message: "",
    severity: "info"
}, action){
    switch(action.type){
        case OPEN_TOASTER:
            return {
                open: true,
                message: action.payload.message,
                severity:  action.payload.severity
            }
        case CLOSE_TOASTER:
            return {
                open: false,
                message: "",
                severity: "info"
            }
        default: 
            return state
    }
}