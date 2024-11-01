import React, { useEffect, useRef } from 'react';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import 'styles/App.css';
import Modal from 'react-modal';
import ScrollToTop from 'components/common/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './hooks/LanguageContext'; // Import LanguageProvider

function CommonRouter() {
  Modal.setAppElement(document.getElementById('root'));
  const location = useLocation();
  const checkout = location.pathname.split('/')[1];
  const hideHeader = checkout === 'checkout';
  return (
    <>
     <LanguageProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_KEY}>
        <ScrollToTop />
        {!hideHeader && <Header />}
        <Outlet />
        {!hideHeader && <Footer />}
      </GoogleOAuthProvider>
     </LanguageProvider>
    </>
  );
}

export default CommonRouter;
