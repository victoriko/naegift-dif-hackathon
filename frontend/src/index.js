import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'styles/index.css';
import 'react-photo-view/dist/react-photo-view.css';
import router from './ProviderRouter'; // router를 가져오는 구문 수정
import reportWebVitals from 'reportWebVitals';
import { Provider } from 'react-redux';
import store from './state/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
