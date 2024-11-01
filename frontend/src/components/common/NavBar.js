import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from 'styles/components/Navbar.module.css';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function Navbar() {
  const location = useLocation();
  const [isAdminPage, setIsAdminPage] = useState();
  const navigate = useNavigate();
  const { storeNo } = useParams();
  const { language } = useLanguage(); // Only use language state

  const onClickUserAuth = (path) => {
    const kakaoaccess_token = localStorage.getItem('Access_Token');
    const googleaccess_token = localStorage.getItem('googleaccess_token');
    const naveraccess_token = localStorage.getItem('com.naver.nid.access_token');

    if (naveraccess_token || kakaoaccess_token || googleaccess_token) {
      navigate(path);
    } else {
      navigate(`/login/${storeNo}`);
    }
  };

  const onClickAdminAuth = (path) => {
    const adminaccess_token = localStorage.getItem('adminaccess_token');

    if (adminaccess_token) {
      navigate(path);
    } else {
      navigate(`/admin/login/${storeNo}/normal`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setIsAdminPage(location.pathname.startsWith('/admin'));
  }, [location]);

  const renderNavBar = () => {
    const t = translations[language]; // Select translation based on current language

    if (isAdminPage) {
      return (
        <div className={styles.navbar}>
          <div
            onClick={() => onClickAdminAuth(`/admin/status/${storeNo}`)}
            className={
              isActive(`/admin/status/${storeNo}`)
                ? styles.navItemsSelected
                : styles.navItems
            }
          >
            {t.giftStatus}
          </div>
          <div
            onClick={() => onClickAdminAuth(`/admin/verification/${storeNo}`)}
            className={
              isActive(`/admin/verification/${storeNo}`)
                ? styles.navItemsSelected
                : styles.navItems
            }
          >
            {t.giftVerification}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.navbar}>
          <div
            className={
              isActive(`/${storeNo}`)
                ? styles.navItemsSelected
                : styles.navItems
            }
            onClick={() => onClickUserAuth(`/${storeNo}`)}
          >
            {t.home}
          </div>
          <div
            className={
              isActive(`/${storeNo}/received`)
                ? styles.navItemsSelected
                : styles.navItems
            }
            onClick={() =>
              onClickUserAuth(`/${storeNo}/received?status=unused`)
            }
          >
            {t.receivedGifts}
          </div>
          <div
            className={
              isActive(`/${storeNo}/sent`)
                ? styles.navItemsSelected
                : styles.navItems
            }
            onClick={() => onClickUserAuth(`/${storeNo}/sent?status=unused`)}
          >
            {t.sentGifts}
          </div>
        </div>
      );
    }
  };

  return renderNavBar();
}