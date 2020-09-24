import { createStore} from 'redux';
import combinedReducers from './combinedReducers';

export const store = createStore(combinedReducers);