import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from 'styles/components/Footer.module.css';
import { googleLogout } from '@react-oauth/google';
import Swal from 'sweetalert2';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pathname, setPathname] = useState('/');
  const { storeNo } = useParams();
  const kakaoaccesstoken = localStorage.getItem('Access_Token');
  const adminaccesstoken = localStorage.getItem('adminaccess_token');
  const googleaccesstoken = localStorage.getItem('googleaccess_token');
  const naveraccesstoken = localStorage.getItem('com.naver.nid.access_token');
  const { language, toggleLanguage } = useLanguage(); // Use language state and toggle function
  const t = translations[language]; // Translations short-hand

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    if (naveraccesstoken) {
      Swal.fire({
        icon: 'success',
        title: t.userLogout,
      }).then(() => {
        localStorage.removeItem('com.naver.nid.access_token');
        localStorage.removeItem('com.naver.nid.oauth.state_token');
        navigate(`/${storeNo}`);
      });
    }
    if (googleaccesstoken) {
      googleLogout();
      Swal.fire({
        icon: 'success',
        title: t.userLogout,
      }).then(() => {
        localStorage.removeItem('googleaccess_token');
        navigate(`/${storeNo}`);
      });
    }
    if (kakaoaccesstoken) {
      Swal.fire({
        icon: 'success',
        title: t.userLogout,
      }).then(() => {
        localStorage.removeItem('Access_Token');
        navigate(`/${storeNo}`);
      });
    }
  };
  const handleAdminLogout = async () => {
    if (adminaccesstoken) {
      Swal.fire({
        icon: 'success',
        title: t.adminLogout,
      }).then(() => {
        localStorage.removeItem('adminaccess_token');
        navigate(`/${storeNo}`);
      });
    }
  };

  // 페이지에 따라 다른 푸터 렌더링
  const renderFooter = () => {
    if (pathname === '/checkout') {
      return;
    } else if (pathname.includes('/admin')) {
      return (
        <div className={styles.footer}>
          <div className={styles.frame1}>
            <div className={styles.container}>
              <button onClick={toggleLanguage} className={styles.languageToggle}>
                {language === 'ko' ? 'KO' : 'EN'}
              </button>
              <div
                className={styles.subcontainerText3}
                onClick={handleAdminLogout}
              >
                {!adminaccesstoken ? null : t.adminLogout}
              </div>
              <div className={styles.containerText}>
                {t.footerAddress}
              </div>
              <div className={styles.subcontainer}>
                <div className={styles.subcontainerText1}>{t.phone} </div>
                <div className={styles.subcontainerText2}>|</div>
                <div className={styles.subcontainerText3}>{t.email}</div>
              </div>
            </div>
            <div className={styles.button}>
              <div className={styles.buttonText}>
                {t.giftHome} www.naegift.com/naegift-kor-1
              </div>
            </div>
          </div>
          <div className={styles.frame2}>{t.poweredBy}</div>
        </div>
      );
    } else {
      return (
        <div className={styles.footer}>
          <div className={styles.frame1}>
            <div className={styles.container}>
              <button onClick={toggleLanguage} className={styles.languageToggle}>
                {language === 'ko' ? 'EN' : 'KO'}
              </button>
              <div className={styles.subcontainerText3} onClick={handleLogout}>
                {!kakaoaccesstoken ? null : t.userLogout}
              </div>
              <div className={styles.containerText}>
                {t.footerAddress}
              </div>
              <div className={styles.subcontainer}>
                <div className={styles.subcontainerText1}>{t.phone} </div>
                <div className={styles.subcontainerText2}>|</div>
                <div className={styles.subcontainerText3}>{t.email}</div>
              </div>
            </div>
            <div className={styles.button}>
              <div className={styles.buttonText}>
                {t.giftHome} www.naegift.com/naegift-kor-1
              </div>
            </div>
          </div>
          <div className={styles.frame2}>{t.poweredBy}</div>
        </div>
      );
    }
  };

  return renderFooter();
}

