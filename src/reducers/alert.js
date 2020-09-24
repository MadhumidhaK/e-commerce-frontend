import { CLOSE_ALERT, OPEN_ALERT } from "../constants/actions";

export default function(state={
    open: false,
    title: "",
    alertText: "",
    needCancel: true,
    handleOk: null,
    handleCancel: null,
    cancelText: "",
    okText: ""
}, action){
    switch(action.type){
        case OPEN_ALERT:
            return {
                open: true,
                alertText: action.payload.alertText,
                title: action.payload.title,
                needCancel: action.payload.needCancel,
                handleOk: action.payload.handleOk,
                handleCancel: action.payload.handleCancel,
                cancelText: action.payload.cancelText,
                okText: action.payload.okText
            }
        case CLOSE_ALERT: 
            return {
                open: false,
                title: "",
                alertText: "",
                needCancel: true,
                handleOk: null,
                handleCancel: null,
                cancelText: "",
                okText: ""
            }
        default:
            return state
    }
}