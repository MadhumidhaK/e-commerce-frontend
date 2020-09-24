import { combineReducers } from "redux";
import alert from './reducers/alert';
import auth from './reducers/auth';
import user from './reducers/user';
import cart from './reducers/cart';
import toaster from './reducers/toaster';
import order from './reducers/order';
import categories from './reducers/categories';

export default combineReducers({
    alert,
    auth,
    order,
    user,
    cart,
    toaster,
    categories
})