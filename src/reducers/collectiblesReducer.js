import { LOAD_COLLECTIBLES } from '../actions/types';

const CollectiblesReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_COLLECTIBLES:
      return  action.payload

    default:
      return state;
  }
};

export default CollectiblesReducer;
