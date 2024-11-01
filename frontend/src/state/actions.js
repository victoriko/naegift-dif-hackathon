export const SET_PURCHASE_INFO = 'SET_PURCHASE_INFO';
export const SET_STORENO_INFO = 'SET_STORENO_INFO';

export const setPurchaseInfo = (purchaseInfo) => ({
  type: SET_PURCHASE_INFO,
  payload: purchaseInfo,
});

export const setStoreNoInfo = (storeNoInfo) => ({
  type: SET_STORENO_INFO,
  payload: storeNoInfo,
});
