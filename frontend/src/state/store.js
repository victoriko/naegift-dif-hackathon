import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import purchaseInfoReducer from './reducers';
import storeNoReducer from './reducers'; // 새로운 리듀서 추가

const rootReducer = combineReducers({
  purchaseInfo: purchaseInfoReducer,
  storeNo: storeNoReducer, // 새로운 리듀서 추가
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
export default store;
