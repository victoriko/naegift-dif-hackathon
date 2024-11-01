import { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import styles from 'styles/components/Submenu.module.css';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function Submenu() {
  const location = useLocation();
  const [pathname, setPathname] = useState('');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('unused');
  const { language } = useLanguage(); // Use language state

  useEffect(() => {
    setPathname(location.pathname);
    setStatus(searchParams.get('status'));
  }, [location, searchParams]);

  const renderSubmenu = () => {
    return (
      <div className={styles.submenu}>
        <Link
          to={pathname + '?status=unused'}
          className={
            status === 'unused' ? styles.buttonSelected : styles.button
          }
        >
          {translations[language].unused}
        </Link>
        <Link
          to={pathname + '?status=unavailable'}
          className={
            status === 'unavailable' ? styles.buttonSelected : styles.button
          }
        >
          {translations[language].unavailable}
        </Link>
        <Link
          to={pathname + '?status=all'}
          className={status === 'all' ? styles.buttonSelected : styles.button}
        >
          {translations[language].all}
        </Link>
      </div>
    );
  };

  return renderSubmenu();
}