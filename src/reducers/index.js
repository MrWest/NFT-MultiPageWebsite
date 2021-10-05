import { combineReducers } from 'redux';
import CollectiblesReducer from './collectiblesReducer';
import NetworkReducer from './networkReducer';

export default combineReducers({
    networkReducer: NetworkReducer,
    collectiblesReducer: CollectiblesReducer
});