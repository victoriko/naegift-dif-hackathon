// reducers.js
import { SET_PURCHASE_INFO } from './actions';
import { SET_STORENO_INFO } from './actions';

const initialState = {
  purchaseInfo: null,
};

const purchaseInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PURCHASE_INFO:
      return {
        ...state,
        purchaseInfo: action.payload,
      };
    case SET_STORENO_INFO:
      return {
        ...state,
        storeNo: action.payload,
      };
    default:
      return state;
  }
};

export default purchaseInfoReducer;
