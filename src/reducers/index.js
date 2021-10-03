import { combineReducers } from 'redux';

import NetworkReducer from './networkReducer';

export default combineReducers({
    networkReducer: NetworkReducer
});