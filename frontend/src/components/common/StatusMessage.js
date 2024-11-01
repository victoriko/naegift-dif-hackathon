import styles from 'styles/components/StatusMessage.module.css';
import translations from '../../utils/translations'; // 번역 객체 가져오기
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook

export default function StatusMessage({ situation, status, desc }) {
  const { language } = useLanguage(); // Use language state
  const t = translations[language]; // Translations short-hand
  
  const renderStatusMessage = () => {
    if (situation === 'gift') {
      if (status === 'success') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/success.png"
              alt="success"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.success}`}>
                {t.giftSendSuccess}
              </span>
              <span className={`${styles.explanation} ${styles.success}`}>
                {t.checkSentGift}
              </span>
            </div>
          </div>
        );
      } else if (status === 'failure') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/failure.png"
              alt="failure"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.failure}`}>
                {t.giftSendFailure}
              </span>
              <span className={`${styles.explanation} ${styles.failure}`}>
                ({t.reason} {t.paymentError})
              </span>
            </div>
          </div>
        );
      }
    } else if (situation === 'verification') {
      if (status === 'success') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/success.png"
              alt="success"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.success}`}>
                {t.giftVerificationSuccess}
              </span>
            </div>
          </div>
        );
      } else if (status === 'failure') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/failure.png"
              alt="failure"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.failure}`}>
                {t.giftVerificationFailure}
              </span>
              <span className={`${styles.explanation} ${styles.failure}`}>
                ({t.verificationReason} {desc})
              </span>
            </div>
          </div>
        );
      }
    } else if (situation === 'claim') {
      if (status === 'success') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/success.png"
              alt="success"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.success}`}>
                {t.giftClaimSuccess}
              </span>
              <span className={`${styles.explanation} ${styles.success}`}>
                {t.checkReceivedGift}
              </span>
            </div>
          </div>
        );
      } else if (status === 'failure') {
        return (
          <div className={styles.messageContainer}>
            <img
              className={styles.statusIcon}
              src="/icons/failure.png"
              alt="failure"
            />
            <div className={styles.message}>
              <span className={`${styles.alert} ${styles.failure}`}>
                {t.giftClaimFailure}
              </span>
              <span className={`${styles.explanation} ${styles.failure}`}>
                ({t.claimReason} {t.expiredValidity})
              </span>
            </div>
          </div>
        );
      }
    }
  };

  return renderStatusMessage();
}
