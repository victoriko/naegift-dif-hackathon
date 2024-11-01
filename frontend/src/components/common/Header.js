import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import styles from 'styles/components/Header.module.css';

export default function Header() {
  const { storeNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState('/');
  const [store, setStore] = useState(
    JSON.parse(localStorage.getItem(`store_${storeNo}`))
  ); // 로컬스토리지에서 캐시된 상점 정보를 불러옴
  const { language } = useLanguage(); // Use language state and toggle function

  const onErrorImg = (e) => {
    e.target.src = 'images/no-image.png';
  };

  const fetchStoreInfo = async () => {
    if (!store) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/store/character/${storeNo}`
        );
        setStore(response.data.data);
        localStorage.setItem(
          `store_${storeNo}`,
          JSON.stringify(response.data.data)
        ); // 상점 정보를 로컬스토리지에 저장
      } catch (error) {
        console.error('Error fetching store information:', error);
      }
    }
  };

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
   
      fetchStoreInfo();
   
  }, [storeNo, store]); // store가 없을 때만 API 요청을 하도록 설정

  const renderHeader = () => {
    if (
      pathname === '/login' ||
      pathname === '/admin/login' ||
      pathname === '/checkout'
    ) {
      return;
    } else if (pathname === '/gift' || pathname.startsWith('/gift/')) {
      return (
        <div className={styles.giftHeader}>
          <div className={styles.giftHeaderFrame}>
            <div className={styles.giftHeaderText}>
              {language === 'ko' ? '선물하기' : 'Send Gift'}
            </div>
          </div>
        </div>
      );
    } else if (pathname === '/claim') {
      return (
        <div className={styles.claimHeader} onClick={() => navigate('/')}>
          <img className={styles.claimLogo} src="/images/logo.png" alt="logo" />
          <div className={styles.giftHeaderText}>
            {language === 'ko' ? '카페봄봄 기프트샵' : 'Cafe Bombom Gift Shop'}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.header}>
          <div onClick={() => navigate(`/${storeNo}`)}>
            <img
              className={styles.logo}
              //src={store ? store.thumbnailUrl : ''}
              src={ 'https://api-dev.naegift.com/store/thumbnail/20240619/1718780450666.jpg'} 
              onError={onErrorImg}
              alt="naegift__logo"
            />
          </div>

          <div className={styles.containerText}>
            {store ? store.storeName : null}
          </div>
          <div
            className={styles.button}
            onClick={() => navigate(`/admin/login/${storeNo}/normal`)}
          >
            <div className={styles.buttonText}>
              {language === 'ko' ? '관리자' : 'Admin'} <br />
              {language === 'ko' ? '페이지' : 'Page'}
            </div>
          </div>
        </div>
      );
    }
  };

  return renderHeader();
}
