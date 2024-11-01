import QRCode from 'react-qr-code';
import styles from 'styles/components/QR.module.css';
import translations from '../../utils/translations'; // Import translations
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook

export default function QR({ storeNo, memberGiftNo, giftName }) {
  // 상태에 따라 다른 QR 코드 렌더링
  const { language } = useLanguage(); // Use language state  const renderQRCode = () => {
      return (
        <div className={styles.qrContainer}>
          <div className={styles.qrFrame}>
            <div className={styles.qr}>
              <span>
              
                <span className={`${styles.qrText} ${styles.medium}`}>
                  {giftName}
                  <br />
                  {translations[language].giftQr}
                </span>
              </span>
            </div>
          </div>
          <QRCode
            size={100}
            // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${process.env.REACT_APP_FRONT_DOMAIN}/admin/verifyconfirm/${storeNo}/${memberGiftNo}`}
            viewBox={`0 0 100 100`}
          />
        </div>
      );
  };

/**  <span className={`${styles.qrText} ${styles.regular}`}>
                  [내기프트]
                  <br />
                </span> */